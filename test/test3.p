cnf(agatha,hypothesis,
    lives(agatha) ).

cnf(butler,hypothesis,
    lives(butler) ).

cnf(charles,hypothesis,
    lives(charles) ).

cnf(poorer_killer,hypothesis,
    ( ~ killed(X,Y)
    | ~ richer(X,Y) ) ).

cnf(different_hates,hypothesis,
    ( ~ hates(agatha,X)
    | ~ hates(charles,X) ) ).

cnf(no_one_hates_everyone,hypothesis,
    ( ~ hates(X,agatha)
    | ~ hates(X,butler)
    | ~ hates(X,charles) ) ).

cnf(agatha_hates_agatha,hypothesis,
    hates(agatha,agatha) ).

cnf(agatha_hates_charles,hypothesis,
    hates(agatha,charles) ).

cnf(killer_hates_victim,hypothesis,
    ( ~ killed(X,Y)
    | hates(X,Y) ) ).

cnf(same_hates,hypothesis,
    ( ~ hates(agatha,X)
    | hates(butler,X) ) ).

cnf(butler_hates_poor,hypothesis,
    ( ~ lives(X)
    | richer(X,agatha)
    | hates(butler,X) ) ).

%----Literal dropped from here to make it unsatisfiable

cnf(prove_neither_charles_nor_butler_did_it,negated_conjecture,
    ( killed(butler,agatha)
    | killed(charles,agatha) ) ).
