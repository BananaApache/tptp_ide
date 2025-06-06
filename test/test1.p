

%~ This should work fine


% Normal formula
fof(test1, axiom, p(X)).


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


% Different formulas
% thf(foo,lemma,  % higher-order formula
%   (! [X:$i] :  (p(X) => q(X))) ).
% tff(bar,conjecture,  % first-order formula with types
%   ! [Y:$i] : ( r(Y) | s(Y) ) ).
% tcf(baz,conjecture,
%   ! [Z] : ( t(Z) & u(Z) ) ).
% cnf(cl1,plain,
%   ( ~p(A) | q(A) ) ).
% tpi(tp1,plain,
%   p(a) ).





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


 
