Handles aspects of the Rodux store for the game.

Both the server and client have Rodux stores for each player in game, storing the play state.

### Design

Reducers are implemented in a manner that typically invalid state (e.g., purchasing to a negative currency).

It is up the the dispatchers of these actions to validate against such queries.

### Tests

Tests in `tests` are structured so that each action is tested against the desired behavior.
