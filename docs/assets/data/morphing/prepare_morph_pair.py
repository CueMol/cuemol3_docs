#!/usr/bin/env python3
"""Prepare an atom-matched PDB pair for the morphing tutorial.

Source entries: 1AKE (closed) and 4AKE (open), E. coli adenylate kinase.
Download the raw files from RCSB and run:

    curl -O https://files.rcsb.org/download/1AKE.pdb
    curl -O https://files.rcsb.org/download/4AKE.pdb
    python3 prepare_morph_pair.py 1AKE.pdb 4AKE.pdb

Output: adk-closed.pdb.gz / adk-open.pdb.gz in the working directory.

Processing: keep chain A protein atoms (ATOM records) only, drop
hydrogens and alternate locations (first altloc wins), then restrict
both models to the per-residue intersection of their atom names so the
two files carry exactly the same atoms in the same order. MorphMol
frames require matching atom composition; this guarantees it.
"""

import gzip
import sys

CHAIN = "A"


def read_atoms(path):
    """Return {(resseq, icode): {atom_name: line}} for chain A ATOM records."""
    residues = {}
    seen = set()
    with open(path) as f:
        for line in f:
            if not line.startswith("ATOM"):
                continue
            if line[21] != CHAIN:
                continue
            name = line[12:16].strip()
            if name.startswith("H") or line[76:78].strip() == "H":
                continue
            altloc = line[16]
            key = (line[22:26], line[26], name)
            if altloc not in (" ", "A"):
                continue
            if key in seen:  # first altloc wins
                continue
            seen.add(key)
            reskey = (line[22:26], line[26])
            # clear the altloc column so the output carries no altlocs
            residues.setdefault(reskey, {})[name] = line[:16] + " " + line[17:]
    return residues


def write_matched(path_out, residues, order, remarks):
    serial = 0
    with gzip.open(path_out, "wt") as f:
        for r in remarks:
            f.write("REMARK 300 %s\n" % r)
        for reskey, names in order:
            for name in names:
                serial += 1
                line = residues[reskey][name]
                f.write(line[:6] + "%5d" % serial + line[11:].rstrip() + "\n")
        f.write("TER\nEND\n")


def main(path_closed, path_open):
    closed = read_atoms(path_closed)
    opened = read_atoms(path_open)
    common_res = [k for k in closed if k in opened]
    common_res.sort(key=lambda k: (int(k[0]), k[1]))
    order = []
    n_atoms = 0
    for reskey in common_res:
        names = [n for n in closed[reskey] if n in opened[reskey]]
        order.append((reskey, names))
        n_atoms += len(names)
    origin = "Derived from PDB entries 1AKE (closed) and 4AKE (open), chain %s." % CHAIN
    detail = "Protein atoms only; restricted to the shared atom set (%d atoms, %d residues)." % (
        n_atoms, len(common_res))
    write_matched("adk-closed.pdb.gz", closed, order, [origin, detail])
    write_matched("adk-open.pdb.gz", opened, order, [origin, detail])
    print("residues: %d  atoms: %d (per file)" % (len(common_res), n_atoms))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
