%------------------------------------------------------------------------------
% File     : E---3.2.5
% Problem  : SOT_UGQ2XW : v?.?.?
% Transfm  : none
% Format   : tptp:raw
% Command  : run_E %s %d THM

% Computer : quoll
% Model    : x86_64 x86_64
% CPU      : Intel(R) Xeon(R) CPU E5-4610 0 @ 2.40GHz
% Memory   : 128831MB
% OS       : Linux 6.8.0-59-generic
% CPULimit : 60s
% WCLimit  : 0s
% DateTime : Sat Jun  7 16:23:54 UTC 2025

% Result   : Unsatisfiable 0.04s 0.03s
% Output   : CNFRefutation 0.04s
% Verified : 
% SZS Type : Refutation
%            Derivation depth      :    6
%            Number of leaves      :   10
% Syntax   : Number of clauses     :   33 (  13 unt;   5 nHn;  33 RR)
%            Number of literals    :   59 (   0 equ;  32 neg)
%            Maximal clause size   :    3 (   1 avg)
%            Maximal term depth    :    1 (   1 avg)
%            Number of predicates  :    5 (   4 usr;   1 prp; 0-2 aty)
%            Number of functors    :    3 (   3 usr;   3 con; 0-0 aty)
%            Number of variables   :   24 (   0 sgn)

% Comments : 
%------------------------------------------------------------------------------
cnf(same_hates,hypothesis,
    ( hates(butler,X1)
    | ~ hates(agatha,X1) ),
    file('/tmp/Bjkh7sT07D/SOT_UGQ2XW',same_hates) ).

cnf(no_one_hates_everyone,hypothesis,
    ( ~ hates(X1,agatha)
    | ~ hates(X1,butler)
    | ~ hates(X1,charles) ),
    file('/tmp/Bjkh7sT07D/SOT_UGQ2XW',no_one_hates_everyone) ).

cnf(agatha_hates_agatha,hypothesis,
    hates(agatha,agatha),
    file('/tmp/Bjkh7sT07D/SOT_UGQ2XW',agatha_hates_agatha) ).

cnf(agatha_hates_charles,hypothesis,
    hates(agatha,charles),
    file('/tmp/Bjkh7sT07D/SOT_UGQ2XW',agatha_hates_charles) ).

cnf(different_hates,hypothesis,
    ( ~ hates(agatha,X1)
    | ~ hates(charles,X1) ),
    file('/tmp/Bjkh7sT07D/SOT_UGQ2XW',different_hates) ).

cnf(butler_hates_poor,hypothesis,
    ( richer(X1,agatha)
    | hates(butler,X1)
    | ~ lives(X1) ),
    file('/tmp/Bjkh7sT07D/SOT_UGQ2XW',butler_hates_poor) ).

cnf(killer_hates_victim,hypothesis,
    ( hates(X1,X2)
    | ~ killed(X1,X2) ),
    file('/tmp/Bjkh7sT07D/SOT_UGQ2XW',killer_hates_victim) ).

cnf(poorer_killer,hypothesis,
    ( ~ killed(X1,X2)
    | ~ richer(X1,X2) ),
    file('/tmp/Bjkh7sT07D/SOT_UGQ2XW',poorer_killer) ).

cnf(butler,hypothesis,
    lives(butler),
    file('/tmp/Bjkh7sT07D/SOT_UGQ2XW',butler) ).

cnf(prove_neither_charles_nor_butler_did_it,negated_conjecture,
    ( killed(butler,agatha)
    | killed(charles,agatha) ),
    file('/tmp/Bjkh7sT07D/SOT_UGQ2XW',prove_neither_charles_nor_butler_did_it) ).

cnf(c_0_10,hypothesis,
    ( hates(butler,X1)
    | ~ hates(agatha,X1) ),
    inference(fof_simplification,[status(thm)],[same_hates]) ).

cnf(c_0_11,hypothesis,
    ( ~ hates(X1,agatha)
    | ~ hates(X1,butler)
    | ~ hates(X1,charles) ),
    inference(fof_simplification,[status(thm)],[no_one_hates_everyone]) ).

cnf(c_0_12,hypothesis,
    ( hates(butler,X1)
    | ~ hates(agatha,X1) ),
    c_0_10 ).

cnf(c_0_13,hypothesis,
    hates(agatha,agatha),
    agatha_hates_agatha ).

cnf(c_0_14,hypothesis,
    hates(agatha,charles),
    agatha_hates_charles ).

cnf(c_0_15,hypothesis,
    ( ~ hates(agatha,X1)
    | ~ hates(charles,X1) ),
    inference(fof_simplification,[status(thm)],[different_hates]) ).

cnf(c_0_16,hypothesis,
    ( richer(X1,agatha)
    | hates(butler,X1)
    | ~ lives(X1) ),
    inference(fof_simplification,[status(thm)],[butler_hates_poor]) ).

cnf(c_0_17,hypothesis,
    ( ~ hates(X1,agatha)
    | ~ hates(X1,butler)
    | ~ hates(X1,charles) ),
    c_0_11 ).

cnf(c_0_18,hypothesis,
    hates(butler,agatha),
    inference(spm,[status(thm)],[c_0_12,c_0_13]) ).

cnf(c_0_19,hypothesis,
    hates(butler,charles),
    inference(spm,[status(thm)],[c_0_12,c_0_14]) ).

cnf(c_0_20,hypothesis,
    ( hates(X1,X2)
    | ~ killed(X1,X2) ),
    inference(fof_simplification,[status(thm)],[killer_hates_victim]) ).

cnf(c_0_21,hypothesis,
    ( ~ hates(agatha,X1)
    | ~ hates(charles,X1) ),
    c_0_15 ).

cnf(c_0_22,hypothesis,
    ( ~ killed(X1,X2)
    | ~ richer(X1,X2) ),
    inference(fof_simplification,[status(thm)],[poorer_killer]) ).

cnf(c_0_23,hypothesis,
    ( richer(X1,agatha)
    | hates(butler,X1)
    | ~ lives(X1) ),
    c_0_16 ).

cnf(c_0_24,hypothesis,
    lives(butler),
    butler ).

cnf(c_0_25,hypothesis,
    ~ hates(butler,butler),
    inference(cn,[status(thm)],[inference(rw,[status(thm)],[inference(spm,[status(thm)],[c_0_17,c_0_18]),c_0_19])]) ).

cnf(c_0_26,hypothesis,
    ( hates(X1,X2)
    | ~ killed(X1,X2) ),
    c_0_20 ).

cnf(c_0_27,negated_conjecture,
    ( killed(butler,agatha)
    | killed(charles,agatha) ),
    prove_neither_charles_nor_butler_did_it ).

cnf(c_0_28,hypothesis,
    ~ hates(charles,agatha),
    inference(spm,[status(thm)],[c_0_21,c_0_13]) ).

cnf(c_0_29,hypothesis,
    ( ~ killed(X1,X2)
    | ~ richer(X1,X2) ),
    c_0_22 ).

cnf(c_0_30,hypothesis,
    richer(butler,agatha),
    inference(sr,[status(thm)],[inference(spm,[status(thm)],[c_0_23,c_0_24]),c_0_25]) ).

cnf(c_0_31,negated_conjecture,
    killed(butler,agatha),
    inference(sr,[status(thm)],[inference(spm,[status(thm)],[c_0_26,c_0_27]),c_0_28]) ).

cnf(c_0_32,hypothesis,
    $false,
    inference(cn,[status(thm)],[inference(rw,[status(thm)],[inference(spm,[status(thm)],[c_0_29,c_0_30]),c_0_31])]),
    [proof] ).

%------------------------------------------------------------------------------
%----ORIGINAL SYSTEM OUTPUT
% Running first-order theorem proving
% Running: /home/tptp/Systems/E---3.2.5/eprover --delete-bad-limit=2000000000 --definitional-cnf=24 -s --print-statistics -R --print-version --proof-object --auto-schedule=8 --cpu-limit=60 /tmp/Bjkh7sT07D/SOT_UGQ2XW
% # Version: 3.2.5
% # Preprocessing class: FSMSSMSSSSSNFFN.
% # Scheduled 4 strats onto 8 cores with 60 seconds (480 total)
% # Starting G-E--_208_C18_F1_SE_CS_SOS_SP_PS_S5PRR_RG_S04AN with 300s (5) cores
% # Starting new_bool_3 with 60s (1) cores
% # Starting new_bool_1 with 60s (1) cores
% # Starting sh5l with 60s (1) cores
% # G-E--_208_C18_F1_SE_CS_SOS_SP_PS_S5PRR_RG_S04AN with pid 3829767 completed with status 0
% # Result found by G-E--_208_C18_F1_SE_CS_SOS_SP_PS_S5PRR_RG_S04AN
% # Preprocessing class: FSMSSMSSSSSNFFN.
% # Scheduled 4 strats onto 8 cores with 60 seconds (480 total)
% # Starting G-E--_208_C18_F1_SE_CS_SOS_SP_PS_S5PRR_RG_S04AN with 300s (5) cores
% # No SInE strategy applied
% # Search class: FGHNF-FFSM00-SFFFFFNN
% # Scheduled 6 strats onto 5 cores with 300 seconds (300 total)
% # Starting G----_406_C05_02_F1_SE_CS_SP_PS_RG_S04AI with 163s (1) cores
% # Starting G-E--_208_C18_F1_SE_CS_SOS_SP_PS_S5PRR_RG_S04AN with 31s (1) cores
% # Starting new_bool_3 with 28s (1) cores
% # Starting new_bool_1 with 28s (1) cores
% # Starting sh5l with 28s (1) cores
% # G----_406_C05_02_F1_SE_CS_SP_PS_RG_S04AI with pid 3829771 completed with status 0
% # Result found by G----_406_C05_02_F1_SE_CS_SP_PS_RG_S04AI
% # Preprocessing class: FSMSSMSSSSSNFFN.
% # Scheduled 4 strats onto 8 cores with 60 seconds (480 total)
% # Starting G-E--_208_C18_F1_SE_CS_SOS_SP_PS_S5PRR_RG_S04AN with 300s (5) cores
% # No SInE strategy applied
% # Search class: FGHNF-FFSM00-SFFFFFNN
% # Scheduled 6 strats onto 5 cores with 300 seconds (300 total)
% # Starting G----_406_C05_02_F1_SE_CS_SP_PS_RG_S04AI with 163s (1) cores
% # Preprocessing time       : 0.001 s
% # Presaturation interreduction done
% 
% # Proof found!
% # SZS status Unsatisfiable
% # SZS output start CNFRefutation
% See solution above
% # Parsed axioms                        : 12
% # Removed by relevancy pruning/SinE    : 0
% # Initial clauses                      : 12
% # Removed in clause preprocessing      : 0
% # Initial clauses in saturation        : 12
% # Processed clauses                    : 32
% # ...of these trivial                  : 0
% # ...subsumed                          : 0
% # ...remaining for further processing  : 32
% # Other redundant clauses eliminated   : 0
% # Clauses deleted for lack of memory   : 0
% # Backward-subsumed                    : 0
% # Backward-rewritten                   : 1
% # Generated clauses                    : 12
% # ...of the previous two non-redundant : 8
% # ...aggressively subsumed             : 0
% # Contextual simplify-reflections      : 0
% # Paramodulations                      : 12
% # Factorizations                       : 0
% # NegExts                              : 0
% # Equation resolutions                 : 0
% # Disequality decompositions           : 0
% # Total rewrite steps                  : 7
% # ...of those cached                   : 3
% # Propositional unsat checks           : 0
% #    Propositional check models        : 0
% #    Propositional check unsatisfiable : 0
% #    Propositional clauses             : 0
% #    Propositional clauses after purity: 0
% #    Propositional unsat core size     : 0
% #    Propositional preprocessing time  : 0.000
% #    Propositional encoding time       : 0.000
% #    Propositional solver time         : 0.000
% #    Success case prop preproc time    : 0.000
% #    Success case prop encoding time   : 0.000
% #    Success case prop solver time     : 0.000
% # Current number of processed clauses  : 19
% #    Positive orientable unit clauses  : 9
% #    Positive unorientable unit clauses: 0
% #    Negative unit clauses             : 4
% #    Non-unit-clauses                  : 6
% # Current number of unprocessed clauses: 0
% # ...number of literals in the above   : 0
% # Current number of archived formulas  : 0
% # Current number of archived clauses   : 13
% # Clause-clause subsumption calls (NU) : 7
% # Rec. Clause-clause subsumption calls : 5
% # Non-unit clause-clause subsumptions  : 0
% # Unit Clause-clause subsumption calls : 3
% # Rewrite failures with RHS unbound    : 0
% # BW rewrite match attempts            : 1
% # BW rewrite match successes           : 1
% # Condensation attempts                : 0
% # Condensation successes               : 0
% # Termbank termtop insertions          : 412
% # Search garbage collected termcells   : 23
% 
% # -------------------------------------------------
% # User time                : 0.002 s
% # System time              : 0.002 s
% # Total time               : 0.004 s
% # Maximum resident set size: 2604 pages
% 
% # -------------------------------------------------
% # User time                : 0.009 s
% # System time              : 0.008 s
% # Total time               : 0.017 s
% # Maximum resident set size: 2688 pages
% % E exiting
% 
%------------------------------------------------------------------------------
