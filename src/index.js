const ChatParser = require('./ChatParser')
const chalk = require('chalk')

const INPUTS = [
  `14:24:32 Customer : Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `14:24:32 Customer : Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n14:26:15 Agent : Aliquam non cursus erat, ut blandit lectus.`,
  `14:24:32 Customer : Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n14:27:00 Customer : Pellentesque cursus maximus felis, pharetra porta purus aliquet viverra.\n14:27:47 Agent : Vestibulum tempor diam eu leo molestie eleifend.\n14:28:28 Customer : Contrary to popular belief, Lorem Ipsum is not simply random text.`,
  `14:24:32 Customer : Lorem ipsum dolor sit amet, consectetur adipiscing elit.14:26:15 Agent : Aliquam non cursus erat, ut blandit lectus.`,
  `14:24:32 Customer : Lorem ipsum dolor sit amet, consectetur adipiscing elit.14:26:15 Agent : I received it at 12:24:48, ut blandit lectus.`,
  `14:24:32 Luca Galasso : Lorem ipsum dolor sit amet, consectetur adipiscing elit.14:26:15 Emanuele Querzola : I received the package, ut blandit lectus.`,
  `14:24:32 Customer Lorem ipsum dolor sit amet, consectetur adipiscing elit.14:26:15 Agent I received it at 12:24:48, ut blandit lectus.`,
  `54:84:32 Customer Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `00:00:00 Luca D'Alasso : xxx.\n00:00:00 Marshall Bruce Mathers Jr. III : xxx.\n00:00:00 Agent xxx.`
]

function main() {
  const chatParser = new ChatParser()
  for (const input of INPUTS) {
    const info = chatParser.extract(input)
    console.log(chalk.blue('------------------ Message ------------------'))
    console.log(`\n${chalk.green(input)}\n`)
    console.log(JSON.stringify(info, ' ', 2))
    console.log(chalk.blue('---------------------------------------------'))
  }
}

main()