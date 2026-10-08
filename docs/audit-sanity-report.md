# Audit sanity report (read-only)

Generated: 2026-10-08T12:38:14.539Z
Pre-audit: revenue 5000000 €, COGS 65 %, sector general.
Engine: existing `calculateAuditResult` — **no math changes**.

## Coefficients (from PROCESSES)

| Process | weight | costFactor (C_Pi) | wcMultiplier (related to M_WC path) |
|---|---|---|---|
| P1 | 0.18 | 0.15 | 1.4 |
| P2 | 0.22 | 0.2 | 1.6 |
| P3 | 0.25 | 0.25 | 1.8 |
| P4 | 0.2 | 0.15 | 1.5 |
| P5 | 0.15 | 0.1 | 1.4 |

## Profiles

| Profile | overall % | Gap MSP € | Gap WC € | Cost base € | Share MSP | Share WC | WC/MSP |
|---|---|---|---|---|---|---|---|
| all_A | 0.0 | 2008500 | 4038726 | 2762500 | 72.7% | 146.2% | 2.01 |
| all_E | 100.0 | 0 | 0 | 2762500 | 0.0% | 0.0% | — |
| average_C | 60.0 | 357500 | 1415976 | 2762500 | 12.9% | 51.3% | 3.96 |
| good_D | 80.0 | 39000 | 541726 | 2762500 | 1.4% | 19.6% | 13.89 |
| weak_B | 40.0 | 903500 | 2290226 | 2762500 | 32.7% | 82.9% | 2.53 |
| one_very_bad_domain_P3 | 60.0 | 676000 | 1711726 | 2762500 | 24.5% | 62.0% | 2.53 |
| mixed | 55.6 | 525851 | 1621686 | 2762500 | 19.0% | 58.7% | 3.08 |
| borderline_near_MSP | 60.0 | 357500 | 1415976 | 2762500 | 12.9% | 51.3% | 3.96 |

## Domain detail

### all_A

`P1:0.0%(smeGap=351000,wcGap=648375); P2:0.0%(smeGap=403000,wcGap=884000); P3:0.0%(smeGap=637000,wcGap=1374750); P4:0.0%(smeGap=429000,wcGap=720281); P5:0.0%(smeGap=188500,wcGap=411320)`

### all_E

`P1:100.0%(smeGap=0,wcGap=0); P2:100.0%(smeGap=0,wcGap=0); P3:100.0%(smeGap=0,wcGap=0); P4:100.0%(smeGap=0,wcGap=0); P5:100.0%(smeGap=0,wcGap=0)`

### average_C

`P1:60.0%(smeGap=58500,wcGap=238875); P2:60.0%(smeGap=13000,wcGap=260000); P3:60.0%(smeGap=149500,wcGap=497250); P4:60.0%(smeGap=136500,wcGap=281531); P5:60.0%(smeGap=0,wcGap=138320)`

### good_D

`P1:80.0%(smeGap=0,wcGap=102375); P2:80.0%(smeGap=0,wcGap=52000); P3:80.0%(smeGap=0,wcGap=204750); P4:80.0%(smeGap=39000,wcGap=135281); P5:80.0%(smeGap=0,wcGap=47320)`

### weak_B

`P1:40.0%(smeGap=156000,wcGap=375375); P2:40.0%(smeGap=143000,wcGap=468000); P3:40.0%(smeGap=312000,wcGap=789750); P4:40.0%(smeGap=234000,wcGap=427781); P5:40.0%(smeGap=58500,wcGap=229320)`

### one_very_bad_domain_P3

`P1:80.0%(smeGap=0,wcGap=102375); P2:80.0%(smeGap=0,wcGap=52000); P3:0.0%(smeGap=637000,wcGap=1374750); P4:80.0%(smeGap=39000,wcGap=135281); P5:80.0%(smeGap=0,wcGap=47320)`

### mixed

`P1:42.4%(smeGap=144300,wcGap=358995); P2:51.8%(smeGap=66300,wcGap=345280); P3:57.9%(smeGap=166563,wcGap=527963); P4:57.5%(smeGap=148688,wcGap=299813); P5:70.7%(smeGap=0,wcGap=89635)`

### borderline_near_MSP

`P1:60.0%(smeGap=58500,wcGap=238875); P2:60.0%(smeGap=13000,wcGap=260000); P3:60.0%(smeGap=149500,wcGap=497250); P4:60.0%(smeGap=136500,wcGap=281531); P5:60.0%(smeGap=0,wcGap=138320)`


## Flags for owner

- Profiles with world-class share of cost base **> 50 %**: all_A, average_C, weak_B, one_very_bad_domain_P3, mixed, borderline_near_MSP
- `SHOW_WORLD_CLASS_CEILING` default is **false** until owner decides.
- `MAX_DISPLAYED_POTENTIAL_SHARE` placeholder = 0.35 (display only).

## Note

This report does **not** recommend changing `k_Pi`, `S_SME`, `S_WC` or `M_WC`.
If WC shares look unrealistic for typical plants, record decision in `docs/OWNER_DECISIONS.md`.
