class Rover {
   constructor(position, mode, generatorWatts){
      this.position = position;
      this.mode = 'NORMAL';
      this.generatorWatts = 110;
   }
   receiveMessage(message) {
      let roverStatus = {
         mode: this.mode,
         generatorWatts: this.generatorWatts,
         position: this.position
      }
      let payload = {
         message: message.name,
         results: []
      }

      for (let i = 0; i < message.commands.length; i++){
         if (message.commands[i].commandType === 'STATUS_CHECK'){
            payload.results.push({completed: true, roverStatus})
         } else if (message.commands[i].commandType === 'MODE_CHANGE') {
            roverStatus.mode = message.commands[i].value
            payload.results.push({completed: true, roverStatus})
         } else if (message.commands[i].commandType === 'MOVE') {
            if (roverStatus.mode === 'LOW_POWER') {
               payload.results.push({completed: false})
            } else {
               roverStatus.position = message.commands[i].value
               payload.results.push({completed: true})
            }
         } else payload.results.push({completed: true})
      }
      return payload;
   }
}

module.exports = Rover;