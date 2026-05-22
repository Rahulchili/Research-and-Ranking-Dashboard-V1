"""Regenerate META volatility surface chart with cleaner layout (no title overlap)."""
import json, os
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import gridspec
from matplotlib.colors import LinearSegmentedColormap
from datetime import datetime
from mpl_toolkits.mplot3d import Axes3D  # noqa

oc = json.load(open('options_chain.json'))
spot = oc['spot']
recs = oc['records']
exps = oc['expirations']

# Build moneyness grid
moneyness_grid = np.arange(70, 141, 2.5)  # 70%..140% spot
exp_dtes = sorted({r['dte'] for r in recs})
# Surface array — IV by DTE x moneyness
iv_grid = np.full((len(exps), len(moneyness_grid)), np.nan)
exp_dte_map = {}
for r in recs:
    if r.get('call_iv') is None and r.get('put_iv') is None: continue
    e = r['expiry']; ei = exps.index(e)
    exp_dte_map[ei] = r['dte']
    mny = 100 * r['strike'] / spot
    # use put IV below spot, call IV above
    iv = r['put_iv'] if r['strike'] < spot else r['call_iv']
    if iv is None: iv = r['call_iv'] if r['strike'] < spot else r['put_iv']
    if iv is None or iv > 5: continue
    # find closest mny bin
    j = int(np.argmin(np.abs(moneyness_grid - mny)))
    if np.isnan(iv_grid[ei, j]) or abs(mny - moneyness_grid[j]) < 1.5:
        iv_grid[ei, j] = iv * 100

# Linear interpolation per row to fill gaps
for i in range(iv_grid.shape[0]):
    row = iv_grid[i]
    if np.all(np.isnan(row)): continue
    valid = ~np.isnan(row)
    if valid.sum() >= 2:
        iv_grid[i] = np.interp(np.arange(len(row)), np.where(valid)[0], row[valid], left=np.nan, right=np.nan)

# ATM term structure (closest to 100% moneyness)
atm_idx = int(np.argmin(np.abs(moneyness_grid - 100)))
atm_iv = iv_grid[:, atm_idx]
dtes = np.array([exp_dte_map.get(i, np.nan) for i in range(len(exps))])

# 25-delta skew estimate per expiry: IV at 90% moneyness minus IV at 110% moneyness
mny90 = int(np.argmin(np.abs(moneyness_grid - 90)))
mny110 = int(np.argmin(np.abs(moneyness_grid - 110)))
skew_25d = iv_grid[:, mny110] - iv_grid[:, mny90]  # call IV minus put IV proxy

# ----- Plot -----
fig = plt.figure(figsize=(15, 9), facecolor='white')
gs = gridspec.GridSpec(2, 2, width_ratios=[1.05, 1], height_ratios=[1.4, 1], hspace=0.42, wspace=0.30)

# Title bar at the very top — single line
fig.suptitle('META Implied Volatility Surface · 25 Expiries · May 11, 2026 → Dec 15, 2028',
             fontsize=14, fontweight='bold', y=0.985)
fig.text(0.5, 0.948,
         'Strike × Tenor × IV  ·  ATM term structure & skew slices  ·  Spot $%.2f' % spot,
         ha='center', fontsize=10, color='#666')

# (1) Heatmap — top-left
ax1 = fig.add_subplot(gs[0, 0])
im = ax1.imshow(iv_grid.T, aspect='auto', origin='lower', cmap='RdYlBu_r',
                extent=[0, len(exps)-1, moneyness_grid[0], moneyness_grid[-1]],
                vmin=20, vmax=60)
ax1.axhline(100, color='white', lw=1.4, linestyle='-', alpha=0.85)
ax1.text(0.4, 100.6, 'ATM (spot $%.2f)' % spot, color='white', fontsize=8, fontweight='bold', va='bottom')
ax1.set_yticks([70, 80, 90, 100, 110, 120, 130, 140])
ax1.set_yticklabels(['70%','80%','90%','100%','110%','120%','130%','140%'])
ax1.set_xticks(range(len(exps)))
ax1.set_xticklabels([e[5:] for e in exps], rotation=70, fontsize=7)
ax1.set_ylabel('Strike (% of spot)', fontsize=10)
ax1.set_xlabel('Expiry', fontsize=10)
ax1.set_title('IV heatmap — strike × expiry', fontsize=11, pad=8)
cbar = plt.colorbar(im, ax=ax1, fraction=0.040, pad=0.02)
cbar.set_label('IV (%)', fontsize=9)
cbar.ax.tick_params(labelsize=8)

# (2) 3D surface — top-right
ax2 = fig.add_subplot(gs[0, 1], projection='3d')
X, Y = np.meshgrid(np.arange(len(exps)), moneyness_grid)
Z = iv_grid.T
mask = np.isnan(Z)
Z_filled = np.where(mask, np.nanmean(Z), Z)
surf = ax2.plot_surface(X, Y, Z_filled, cmap='RdYlBu_r', vmin=20, vmax=60, alpha=0.9, edgecolor='none')
ax2.set_xticks([0, len(exps)//4, len(exps)//2, 3*len(exps)//4, len(exps)-1])
ax2.set_xticklabels([exps[0][2:7], exps[len(exps)//4][2:7], exps[len(exps)//2][2:7], exps[3*len(exps)//4][2:7], exps[-1][2:7]], fontsize=7)
ax2.set_yticks([70, 90, 110, 130])
ax2.set_yticklabels(['70','90','110','130'], fontsize=8)
ax2.set_xlabel('Expiry', fontsize=8, labelpad=4)
ax2.set_ylabel('Strike %', fontsize=8, labelpad=4)
ax2.set_zlabel('IV (%)', fontsize=8, labelpad=2)
ax2.set_title('3D surface view', fontsize=11, pad=2)
ax2.view_init(elev=22, azim=-58)

# (3) ATM term structure — bottom-left
ax3 = fig.add_subplot(gs[1, 0])
valid = ~np.isnan(atm_iv) & ~np.isnan(dtes)
ax3.plot(dtes[valid], atm_iv[valid], '-o', color='#0F62FE', markersize=5, lw=1.6)
for d, v in zip(dtes[valid], atm_iv[valid]):
    ax3.annotate(f'{v:.1f}%', xy=(d, v), xytext=(0, 7), textcoords='offset points',
                 ha='center', fontsize=7, color='#333')
ax3.set_xlabel('DTE (days)', fontsize=10)
ax3.set_ylabel('ATM IV (%)', fontsize=10)
ax3.set_title('ATM IV term structure (contango)', fontsize=11, pad=8)
ax3.set_xscale('log')
ax3.grid(alpha=0.25, linestyle='--')
ax3.set_ylim(20, 50)

# (4) 25Δ skew per expiry — bottom-right
ax4 = fig.add_subplot(gs[1, 1])
valid_sk = ~np.isnan(skew_25d) & ~np.isnan(dtes)
colors = ['#16A34A' if s > 0 else '#DC2626' for s in skew_25d[valid_sk]]
ax4.bar(np.arange(valid_sk.sum()), skew_25d[valid_sk], color=colors, alpha=0.85, edgecolor='#333', linewidth=0.4)
ax4.axhline(0, color='#333', lw=0.7)
ax4.set_xticks(np.arange(valid_sk.sum())[::2])
ax4.set_xticklabels([exps[i][5:] for i in np.where(valid_sk)[0]][::2], rotation=70, fontsize=7)
ax4.set_ylabel('Skew (vol pts)', fontsize=10)
ax4.set_title('25Δ skew per expiry  (green = bull · call IV > put IV)', fontsize=11, pad=8)
ax4.grid(alpha=0.25, linestyle='--', axis='y')

fig.text(0.5, 0.005,
         'Source: META options chain (meta05082026.xlsx)  ·  5/8/26  ·  Surface uses OTM IV (call above spot · put below) · gaps interpolated within row',
         ha='center', fontsize=8, color='#888', style='italic')

plt.subplots_adjust(top=0.92, bottom=0.06, left=0.06, right=0.97)
out = '../Q2Q_ER_Cowork/management_credibility_project/assets/options/07_volatility_surface.png'
fig.savefig(out, dpi=140, bbox_inches='tight', facecolor='white')
print('saved →', out)
