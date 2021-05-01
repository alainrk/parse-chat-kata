/**
 * Main regex for message info extraction
 * Named groups example:
  * - date:       "14:24:32"
  * - mention:    "14:24:32 Customer : "
  * - sentence:   "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n"
  * - type:       "Customer"
 */
const MAIN_CHAT_REGEX = /(?<mention>(?<date>(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)) (?<type>Agent|Customer|[.' \w]+) (: )?)(?<sentence>(.*.\n?))/gm
const CHUNK_INLINE_REGEX = /(?<mention>(?<date>(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)) [\w ]*:? ?)/g
const TYPES = ['agent', 'customer']

class ChatParser {
  /**
   * Initialize a chat parser
   * @param {RegExp} [mainRegex=MAIN_CHAT_REGEX] main regex for info extraction
   * @param {RegExp} [chunksRegex=CHAT_INLINE_REGEX] regex for chunking inline messages
   * @param {string[]} [types] default types eg. customer, agent
   */
  constructor(mainRegex, chunksRegex, types) {
    this.mainRegex = mainRegex || new RegExp(MAIN_CHAT_REGEX)
    this.chunksRegex = chunksRegex || new RegExp(CHUNK_INLINE_REGEX)
    this.types = types ? new Set(types) : new Set(TYPES)
  }

  /**
   * Extract default types in normalized form or user name
   * @param {string} type
   * @returns {string}
   */
  __getType(type) {
    const normalized = type.toLowerCase(type)
    if (this.types.has(normalized)) {
      return normalized
    }
    return type
  }

  /**
   * Returns chunks from text, including inline joined messages
   * @param {string} text the raw chat text
   * @returns {string[]}
   */
  __getChunks(text) {
    let match
    const chunks = []

    let cursor = 0
    while ((match = this.chunksRegex.exec(text)) != null) {
      const chunk = text.substring(cursor, match.index)
      cursor = match.index
      // Get rid of empty ones
      if (!chunk.trim()) {
        continue
      }
      chunks.push(chunk)
    }
    // Remaining text is the last chunk
    chunks.push(text.substring(cursor, text.length))
    return chunks
  }

  /**
   * Core function of ChatParser
   * 1. Split raw text in coherent chunks of single messages
   * 2. Extract as best as it can semi-structured information from each raw message
   * 3. Returns an array of message info as sorted as they originally were
   * @param {string} text
   * @returns {object[]}
   */
  extract(text) {
    let match
    const msgList = []

    const chunks = this.__getChunks(text)

    for (const chunk of chunks) {
      // For each chunk extract info by named regex groups
      while ((match = this.mainRegex.exec(chunk)) !== null) {
        if (match.groups) {
          const msg = {
            date: match.groups.date,
            mention: match.groups.mention,
            sentence: match.groups.sentence,
            type: this.__getType(match.groups.type)
          }
          msgList.push(msg)
        }
      }
    }

    return msgList
  }
}

module.exports = ChatParser
