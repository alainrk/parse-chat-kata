const { expect } = require('chai')
const ChatParser = require('../ChatParser.js')

describe('ChatParser', function() {
  let chatParser

  before(() => {
    chatParser = new ChatParser()
  })

  describe('Step 1 (single sentence) [note: an example only with a sentence]', () => {
    it('It should retrieve only one sentence', () => {
      const input = `14:24:32 Customer : Lorem ipsum dolor sit amet, consectetur adipiscing elit.`
      const expected = [{
        date: '14:24:32',
        mention: '14:24:32 Customer : ',
        sentence: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        type: 'customer'
      }]

      const result = chatParser.extract(input)

      expect(result).to.have.deep.members(expected)
    })
  })

  describe('Step 2 (two sentences) [note: an example with two sentences divided by new line character]', () => {
    it('It should retrieve two sentences', () => {
      const input = `14:24:32 Customer : Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n14:26:15 Agent : Aliquam non cursus erat, ut blandit lectus.`
      const expected = [{
        date: '14:24:32',
        mention: '14:24:32 Customer : ',
        sentence: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n',
        type: 'customer'
      }, {
        date: '14:26:15',
        mention: '14:26:15 Agent : ',
        sentence: 'Aliquam non cursus erat, ut blandit lectus.',
        type: 'agent'
      }]

      const result = chatParser.extract(input)

      expect(result).to.have.deep.members(expected)
    })
  })

  describe('Step 3 (two customer mentions as start) [note: an example with two customer mentions as start]', () => {
    it('It should retrieve three sentences', () => {
      const input = `14:24:32 Customer : Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n14:27:00 Customer : Pellentesque cursus maximus felis, pharetra porta purus aliquet viverra.\n14:27:47 Agent : Vestibulum tempor diam eu leo molestie eleifend.\n14:28:28 Customer : Contrary to popular belief, Lorem Ipsum is not simply random text.`
      const expected = [{
        date: '14:24:32',
        mention: '14:24:32 Customer : ',
        sentence: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n',
        type: 'customer'
      }, {
        date: '14:27:00',
        mention: '14:27:00 Customer : ',
        sentence: 'Pellentesque cursus maximus felis, pharetra porta purus aliquet viverra.\n',
        type: 'customer'
      }, {
        date: '14:27:47',
        mention: '14:27:47 Agent : ',
        sentence: 'Vestibulum tempor diam eu leo molestie eleifend.\n', // Assuming newline here
        type: 'agent'
      }, {
        date: '14:28:28',
        mention: '14:28:28 Customer : ',
        sentence: 'Contrary to popular belief, Lorem Ipsum is not simply random text.',
        type: 'customer'
      }]

      const result = chatParser.extract(input)

      expect(result).to.have.deep.members(expected)
    })
  })

  describe('Step 4 (date splitting) [note: an example in which the sentences are not divided by the new line character]', () => {
    it('It should retrieve two sentences from one line', () => {
      const input = `14:24:32 Customer : Lorem ipsum dolor sit amet, consectetur adipiscing elit.14:26:15 Agent : Aliquam non cursus erat, ut blandit lectus.`
      const expected = [{
        date: '14:24:32',
        mention: '14:24:32 Customer : ',
        sentence: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        type: 'customer'
      }, {
        date: '14:26:15',
        mention: '14:26:15 Agent : ',
        sentence: 'Aliquam non cursus erat, ut blandit lectus.',
        type: 'agent'
      }]

      const result = chatParser.extract(input)

      expect(result).to.have.deep.members(expected)
    })
  })

  describe('Step 5 (ignore extra dates) [note: an example with a date in the text of the Agent]', () => {
    it('It should retrieve two sentences with date inside', () => {
      const input = `14:24:32 Customer : Lorem ipsum dolor sit amet, consectetur adipiscing elit.14:26:15 Agent : I received it at 12:24:48, ut blandit lectus.`
      const expected = [{
        date: '14:24:32',
        mention: '14:24:32 Customer : ',
        sentence: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        type: 'customer'
      }, {
        date: '14:26:15',
        mention: '14:26:15 Agent : ',
        sentence: 'I received it at 12:24:48, ut blandit lectus.',
        type: 'agent'
      }]

      const result = chatParser.extract(input)

      expect(result).to.have.deep.members(expected)
    })
  })

  describe('Step 6 (full name) [note: an example in which both the Agent and the Customer have full name]', () => {
    it('It should retrieve two sentences from one line and full name', () => {
      const input = `14:24:32 Luca Galasso : Lorem ipsum dolor sit amet, consectetur adipiscing elit.14:26:15 Emanuele Querzola : I received the package, ut blandit lectus.`
      const expected = [{
        date: '14:24:32',
        mention: '14:24:32 Luca Galasso : ',
        sentence: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        type: 'Luca Galasso'
      }, {
        date: '14:26:15',
        mention: '14:26:15 Emanuele Querzola : ',
        sentence: 'I received the package, ut blandit lectus.',
        type: 'Emanuele Querzola'
      }]

      const result = chatParser.extract(input)

      expect(result).to.have.deep.members(expected)
    })
  })

  describe('Step 7 [Extra] (missing colon after the names) [note: an example in which there is no colon after both Agent and Customer names]', () => {
    it('It should retrieve two sentences from one line and no colon', () => {
      const input = `14:24:32 Customer Lorem ipsum dolor sit amet, consectetur adipiscing elit.14:26:15 Agent I received it at 12:24:48, ut blandit lectus.`
      const expected = [{
        date: '14:24:32',
        mention: '14:24:32 Customer ',
        sentence: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        type: 'customer'
      }, {
        date: '14:26:15',
        mention: '14:26:15 Agent ',
        sentence: 'I received it at 12:24:48, ut blandit lectus.',
        type: 'agent'
      }]

      const result = chatParser.extract(input)

      expect(result).to.have.deep.members(expected)
    })
  })

  // Additional tests

  describe('Wrong time', () => {
    it('It should retrieve 0 sentences', () => {
      const input = `54:84:32 Customer Lorem ipsum dolor sit amet, consectetur adipiscing elit.`
      const expected = []

      const result = chatParser.extract(input)

      expect(result).to.have.deep.members(expected)
    })
  })

  describe('Composite or punctuated user names', () => {
    it('It should retrieve three sentences with correct user names', () => {
      const input = `00:00:00 Luca D'Alasso : xxx.\n00:00:00 Marshall Bruce Mathers Jr. III : xxx.\n00:00:00 Agent xxx.`
      const expected = [{
        date: '00:00:00',
        mention: '00:00:00 Luca D\'Alasso : ',
        sentence: 'xxx.\n',
        type: 'Luca D\'Alasso'
      }, {
        date: '00:00:00',
        mention: '00:00:00 Marshall Bruce Mathers Jr. III : ',
        sentence: 'xxx.\n',
        type: 'Marshall Bruce Mathers Jr. III'
      }, {
        date: '00:00:00',
        mention: '00:00:00 Agent ',
        sentence: 'xxx.',
        type: 'agent'
      }]

      const result = chatParser.extract(input)

      expect(result).to.have.deep.members(expected)
    })
  })

})