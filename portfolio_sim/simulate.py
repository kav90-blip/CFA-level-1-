"""Monte Carlo portfolio projection using correlated geometric Brownian motion.

Each asset follows dS/S = mu dt + sigma dW, with correlated shocks via Cholesky.
mu is the expected arithmetic annual return; sigma the annual volatility.
Usage: python simulate.py [portfolio.json] [--plot out.png]
"""
import json, sys
import numpy as np


def simulate(cfg):
    names = list(cfg["assets"])
    w0 = np.array([cfg["assets"][n]["weight"] for n in names])
    mu = np.array([cfg["assets"][n]["mu"] for n in names])
    sig = np.array([cfg["assets"][n]["sigma"] for n in names])
    corr = np.array(cfg["correlations"])
    assert abs(w0.sum() - 1) < 1e-9, "weights must sum to 1"
    L = np.linalg.cholesky(corr)

    spy, years, n = cfg["steps_per_year"], cfg["horizon_years"], cfg["n_paths"]
    steps, dt = spy * years, 1 / cfg["steps_per_year"]
    rng = np.random.default_rng(cfg["seed"])
    contrib = cfg["annual_contribution"] / spy

    # Per-asset gross return each step (exact GBM step, mean = exp(mu*dt))
    z = rng.standard_normal((steps, n, len(names))) @ L.T
    gross = np.exp((mu - 0.5 * sig**2) * dt + sig * np.sqrt(dt) * z)

    holdings = np.tile(cfg["initial_value"] * w0, (n, 1))
    paths = np.empty((steps + 1, n))
    paths[0] = cfg["initial_value"]
    for t in range(steps):
        holdings = holdings * gross[t]
        holdings += contrib * w0  # contributions invested at target weights
        if cfg.get("rebalance", True) and (t + 1) % spy == 0:
            holdings = holdings.sum(1, keepdims=True) * w0
        paths[t + 1] = holdings.sum(1)
    return paths


def report(cfg, paths):
    spy = cfg["steps_per_year"]
    final = paths[-1]
    total_in = cfg["initial_value"] + cfg["annual_contribution"] * cfg["horizon_years"]
    print(f"Horizon {cfg['horizon_years']}y | {cfg['n_paths']} paths | "
          f"contributed {total_in:,.0f}")
    print("\nPercentiles of terminal value:")
    for p in (5, 10, 25, 50, 75, 90, 95):
        print(f"  {p:>2}th: {np.percentile(final, p):>14,.0f}")
    print(f"\nMean: {final.mean():,.0f}   Std: {final.std():,.0f}")
    print(f"P(final < total contributed): {(final < total_in).mean():.1%}")
    print(f"P(final < 0.5x contributed):  {(final < 0.5 * total_in).mean():.1%}")
    peak = np.maximum.accumulate(paths, axis=0)
    mdd = ((paths - peak) / peak).min(axis=0)
    print(f"Median max drawdown: {np.median(mdd):.1%}  (5th pct worst: {np.percentile(mdd, 5):.1%})")


def plot(cfg, paths, out):
    import matplotlib; matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    t = np.arange(paths.shape[0]) / cfg["steps_per_year"]
    fig, ax = plt.subplots(1, 2, figsize=(13, 5))
    for lo, hi, a in ((5, 95, .2), (25, 75, .35)):
        ax[0].fill_between(t, np.percentile(paths, lo, 1), np.percentile(paths, hi, 1),
                           alpha=a, color="tab:blue", label=f"{lo}-{hi}th pct")
    ax[0].plot(t, np.median(paths, 1), color="navy", label="Median")
    ax[0].set(title="Projected portfolio value", xlabel="Years", ylabel="Value"); ax[0].legend()
    ax[1].hist(paths[-1], bins=80, color="tab:blue", alpha=.7)
    ax[1].axvline(np.median(paths[-1]), color="navy", ls="--")
    ax[1].set(title="Terminal value distribution", xlabel="Value")
    fig.tight_layout(); fig.savefig(out, dpi=130)
    print(f"\nSaved chart to {out}")


if __name__ == "__main__":
    args = sys.argv[1:]
    out = args[args.index("--plot") + 1] if "--plot" in args else None
    path = next((a for a in args if a.endswith(".json")), "portfolio.json")
    cfg = json.load(open(path))
    paths = simulate(cfg)
    report(cfg, paths)
    if out: plot(cfg, paths, out)
