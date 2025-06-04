% This should work fine
fof(test1, axiom, p(X)).

% These should show errors:

% Missing period
fof(test2, axiom, p(X))

% Missing closing paren  
fof(test3, axiom, p(X)

% Missing outer parens
fof test4, axiom, p(X).     

% Invalid role (warning)
fof(test5, invalid, p(X)).  
