fof(3, conjecture, q, file('foo.p', 3)).
fof(2, axiom, (p=>q), file('foo.p', 2)).
fof(1, axiom, p, file('foo.p', 1)).
fof(c_0_3, negated_conjecture, ~q, inference(fof_simplification,[status(thm)],[inference(assume_negation,[status(cth)],[3])])).
fof(c_0_4, plain, (~p|q), inference(fof_nnf,[status(thm)],[inference(fof_nnf,[status(thm)],[2])])).
fof(c_0_5, negated_conjecture, ~q, inference(fof_nnf,[status(thm)],[c_0_3])).
cnf(c_0_6, plain, (q|~p), inference(split_conjunct,[status(thm)],[c_0_4])).
cnf(c_0_8, plain, (p), inference(split_conjunct,[status(thm)],[1])).
cnf(c_0_9, plain, (~p), inference(sr,[status(thm)],[c_0_6, c_0_5])).
cnf(c_0_10, plain, ($false), inference(sr,[status(thm)],[c_0_8, c_0_9]), ['proof']).