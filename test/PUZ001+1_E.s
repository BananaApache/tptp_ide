fof(pel55_4, axiom, ![X1, X2]:((killed(X1,X2)=>hates(X1,X2))), file('/home/tptp/TPTP-v9.0.0/Problems/PUZ/PUZ001+1.p', pel55_4)).
fof(pel55_1, axiom, ?[X1]:((lives(X1)&killed(X1,agatha))), file('/home/tptp/TPTP-v9.0.0/Problems/PUZ/PUZ001+1.p', pel55_1)).
fof(pel55_3, axiom, ![X1]:((lives(X1)=>(X1=agatha|X1=butler|X1=charles))), file('/home/tptp/TPTP-v9.0.0/Problems/PUZ/PUZ001+1.p', pel55_3)).
fof(pel55_10, axiom, ![X1]:(?[X2]:(~(hates(X1,X2)))), file('/home/tptp/TPTP-v9.0.0/Problems/PUZ/PUZ001+1.p', pel55_10)).
fof(pel55_5, axiom, ![X1, X2]:((killed(X1,X2)=>~(richer(X1,X2)))), file('/home/tptp/TPTP-v9.0.0/Problems/PUZ/PUZ001+1.p', pel55_5)).
fof(pel55_8, axiom, ![X1]:((~(richer(X1,agatha))=>hates(butler,X1))), file('/home/tptp/TPTP-v9.0.0/Problems/PUZ/PUZ001+1.p', pel55_8)).
fof(pel55_6, axiom, ![X1]:((hates(agatha,X1)=>~(hates(charles,X1)))), file('/home/tptp/TPTP-v9.0.0/Problems/PUZ/PUZ001+1.p', pel55_6)).
fof(pel55_9, axiom, ![X1]:((hates(agatha,X1)=>hates(butler,X1))), file('/home/tptp/TPTP-v9.0.0/Problems/PUZ/PUZ001+1.p', pel55_9)).
fof(pel55_7, axiom, ![X1]:((X1!=butler=>hates(agatha,X1))), file('/home/tptp/TPTP-v9.0.0/Problems/PUZ/PUZ001+1.p', pel55_7)).
fof(pel55_11, axiom, agatha!=butler, file('/home/tptp/TPTP-v9.0.0/Problems/PUZ/PUZ001+1.p', pel55_11)).
fof(pel55, conjecture, killed(agatha,agatha), file('/home/tptp/TPTP-v9.0.0/Problems/PUZ/PUZ001+1.p', pel55)).
fof(c_0_11, plain, ![X4, X5]:((~killed(X4,X5)|hates(X4,X5))), inference(fof_nnf,[status(thm)],[inference(variable_rename,[status(thm)],[inference(fof_nnf,[status(thm)],[pel55_4])])])).
fof(c_0_12, plain, (lives(esk1_0)&killed(esk1_0,agatha)), inference(skolemize,[status(esa)],[inference(variable_rename,[status(thm)],[pel55_1])])).
fof(c_0_13, plain, ![X8]:((~lives(X8)|(X8=agatha|X8=butler|X8=charles))), inference(fof_nnf,[status(thm)],[inference(variable_rename,[status(thm)],[inference(fof_nnf,[status(thm)],[pel55_3])])])).
fof(c_0_14, plain, ![X1]:(?[X2]:(~hates(X1,X2))), inference(fof_simplification,[status(thm)],[pel55_10])).
fof(c_0_15, plain, ![X1, X2]:((killed(X1,X2)=>~richer(X1,X2))), inference(fof_simplification,[status(thm)],[pel55_5])).
fof(c_0_16, plain, ![X1]:((~richer(X1,agatha)=>hates(butler,X1))), inference(fof_simplification,[status(thm)],[pel55_8])).
fof(c_0_17, plain, ![X1]:((hates(agatha,X1)=>~hates(charles,X1))), inference(fof_simplification,[status(thm)],[pel55_6])).
cnf(c_0_18, plain, (hates(X1,X2)|~killed(X1,X2)), inference(split_conjunct,[status(thm)],[c_0_11])).
cnf(c_0_19, plain, (killed(esk1_0,agatha)), inference(split_conjunct,[status(thm)],[c_0_12])).
cnf(c_0_20, plain, (X1=agatha|X1=butler|X1=charles|~lives(X1)), inference(split_conjunct,[status(thm)],[c_0_13])).
cnf(c_0_21, plain, (lives(esk1_0)), inference(split_conjunct,[status(thm)],[c_0_12])).
fof(c_0_22, plain, ![X13]:(~hates(X13,esk2_1(X13))), inference(fof_nnf,[status(thm)],[inference(skolemize,[status(esa)],[inference(variable_rename,[status(thm)],[c_0_14])])])).
fof(c_0_23, plain, ![X12]:((~hates(agatha,X12)|hates(butler,X12))), inference(fof_nnf,[status(thm)],[inference(variable_rename,[status(thm)],[inference(fof_nnf,[status(thm)],[pel55_9])])])).
fof(c_0_24, plain, ![X1]:((X1!=butler=>hates(agatha,X1))), inference(fof_simplification,[status(thm)],[pel55_7])).
fof(c_0_25, plain, ![X6, X7]:((~killed(X6,X7)|~richer(X6,X7))), inference(fof_nnf,[status(thm)],[inference(variable_rename,[status(thm)],[inference(fof_nnf,[status(thm)],[c_0_15])])])).
fof(c_0_26, plain, ![X11]:((richer(X11,agatha)|hates(butler,X11))), inference(variable_rename,[status(thm)],[inference(fof_nnf,[status(thm)],[c_0_16])])).
fof(c_0_27, plain, ![X9]:((~hates(agatha,X9)|~hates(charles,X9))), inference(fof_nnf,[status(thm)],[inference(variable_rename,[status(thm)],[inference(fof_nnf,[status(thm)],[c_0_17])])])).
cnf(c_0_28, plain, (hates(esk1_0,agatha)), inference(spm,[status(thm)],[c_0_18, c_0_19])).
cnf(c_0_29, plain, (esk1_0=charles|esk1_0=butler|esk1_0=agatha), inference(spm,[status(thm)],[c_0_20, c_0_21])).
fof(c_0_30, plain, agatha!=butler, inference(fof_simplification,[status(thm)],[pel55_11])).
cnf(c_0_31, plain, (~hates(X1,esk2_1(X1))), inference(split_conjunct,[status(thm)],[c_0_22])).
cnf(c_0_32, plain, (hates(butler,X1)|~hates(agatha,X1)), inference(split_conjunct,[status(thm)],[c_0_23])).
fof(c_0_33, plain, ![X10]:((X10=butler|hates(agatha,X10))), inference(variable_rename,[status(thm)],[inference(fof_nnf,[status(thm)],[c_0_24])])).
cnf(c_0_34, plain, (~killed(X1,X2)|~richer(X1,X2)), inference(split_conjunct,[status(thm)],[c_0_25])).
cnf(c_0_35, plain, (richer(X1,agatha)|hates(butler,X1)), inference(split_conjunct,[status(thm)],[c_0_26])).
cnf(c_0_36, plain, (~hates(agatha,X1)|~hates(charles,X1)), inference(split_conjunct,[status(thm)],[c_0_27])).
cnf(c_0_37, plain, (esk1_0=agatha|esk1_0=butler|hates(charles,agatha)), inference(spm,[status(thm)],[c_0_28, c_0_29])).
fof(c_0_38, plain, agatha!=butler, inference(fof_nnf,[status(thm)],[c_0_30])).
cnf(c_0_39, plain, (~hates(agatha,esk2_1(butler))), inference(spm,[status(thm)],[c_0_31, c_0_32])).
cnf(c_0_40, plain, (X1=butler|hates(agatha,X1)), inference(split_conjunct,[status(thm)],[c_0_33])).
cnf(c_0_41, plain, (hates(butler,X1)|~killed(X1,agatha)), inference(spm,[status(thm)],[c_0_34, c_0_35])).
cnf(c_0_42, plain, (esk1_0=butler|esk1_0=agatha|~hates(agatha,agatha)), inference(spm,[status(thm)],[c_0_36, c_0_37])).
cnf(c_0_43, plain, (agatha!=butler), inference(split_conjunct,[status(thm)],[c_0_38])).
cnf(c_0_44, plain, (esk2_1(butler)=butler), inference(spm,[status(thm)],[c_0_39, c_0_40])).
fof(c_0_45, negated_conjecture, ~killed(agatha,agatha), inference(fof_simplification,[status(thm)],[inference(assume_negation,[status(cth)],[pel55])])).
cnf(c_0_46, plain, (hates(butler,esk1_0)), inference(spm,[status(thm)],[c_0_41, c_0_19])).
cnf(c_0_47, plain, (esk1_0=agatha|esk1_0=butler), inference(sr,[status(thm)],[inference(spm,[status(thm)],[c_0_42, c_0_40]), c_0_43])).
cnf(c_0_48, plain, (~hates(butler,butler)), inference(spm,[status(thm)],[c_0_31, c_0_44])).
fof(c_0_49, negated_conjecture, ~killed(agatha,agatha), inference(fof_nnf,[status(thm)],[c_0_45])).
cnf(c_0_50, plain, (esk1_0=agatha), inference(sr,[status(thm)],[inference(spm,[status(thm)],[c_0_46, c_0_47]), c_0_48])).
cnf(c_0_51, negated_conjecture, (~killed(agatha,agatha)), inference(split_conjunct,[status(thm)],[c_0_49])).
cnf(c_0_52, plain, ($false), inference(sr,[status(thm)],[inference(rw,[status(thm)],[c_0_19, c_0_50]), c_0_51]), ['proof']).

% E exiting

% END OF SYSTEM OUTPUT
% RESULT: PUZ001+1 - E---3.2.5 says Theorem - CPU = 0.00 WC = 0.05 
% OUTPUT: PUZ001+1 - E---3.2.5 says CNFRefutation - CPU = 0.00 WC = 0.05 