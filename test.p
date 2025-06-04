




%~ This should work fine


% Normal formula
% fof(test1, axiom, p(X)).


% Multi-line formula
% fof(
%     test6, 
%     axiom, 
%     p(X) & q(Y)).


/*
 * block comment
 * another block comment
 bla bla bla
*/





%~ These should show errors:


% Missing period
% fof(test2, axiom, p(X)).


% Missing closing paren
% fof(test3, axiom, p(X)


% Missing outer parens
% fof test4, axiom, p(X).


% Invalid role (warning)
% fof(test5, invalid, p(X)).


% Multi-line formula without period
% fof(pel55_1,axiom,
%     ? [X] :
%       ( lives(X)
%       & killed(X,agatha) ) )


% Several Multi-line formulas without periods
% fof(pel55_1,axiom,
%     ? [X] :
%       ( lives(X)
%       & killed(X,agatha) ) ).

% fof(pel55_2_1,axiom,
%     lives(agatha) )

% fof(pel55_2_2,axiom,
%     lives(butler) )

% fof(pel55_2_3,axiom,
%     lives(charles) ).
