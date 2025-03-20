Routes/handlers:

# $connect:

Called when a client initiates a new connection:

- userName, clientId, partyId are stored to card record
  - If partyId is not provided, a new one is created
- The client is then associated with a party, but NEEDS TO CALL `hello` to actually join it

# $disconnect:

Called when a client disconnects for any reason (including iOS background pause).

- clientId removed from card

# hello:

Called by client when they are ready to officially "join" their party.

- They are sent a response, containing partyId and a list of existing players and their bingo card IDs

```
{
    action: "initial_state",
    data: { partyId: string, users: [{ userName: string, cardId: string }]}
}
```

- A message is sent to other players saying the new client's ID and card ID.

```
{
    action: "join_party",
    data: { userName: string, cardId: string }
}
```

# goodbye:

Called when the client wants to remove themselves from the party.

- A message is sent to other players instructing them to remove clientId from their store.

```
{
    action: "leave_party",
    "data": { userName: string }
}
```
