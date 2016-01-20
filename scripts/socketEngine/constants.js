const clientTypes = {
       FIND_GAME: 'Find Game',
  STOP_FIND_GAME: 'Stop Find Game',
    PLAYER_READY: 'Player Ready',
     GAME_ACTION: 'Game Action'
}

const serverTypes = {
      GAME_FOUND: 'Game Found',
    STATE_UPDATE: 'State Update',
   PLAYER_PROMPT: 'Player Prompt',
           ERROR: 'Error',
  SERVER_MESSAGE: 'Server Message'
}

const internalTypes = {
  CONNECTED: 'Connected'
}

export {
  clientTypes,
  serverTypes,
  internalTypes
}
