/**
 * @typedef {object} UserObj
 * @property {string} UserObj.accessToken
 * @property {string} UserObj.userId
 */
/**
 * @typedef {object} ParsedTrack
 * @property {string} id
 * @property {string} name
 * @property {string} artist
 * @property {string} album_id
 * @property {string} added_at
 * @property {ParsedAlbum} album
 */
/**
 * @typedef {object} ParsedAlbum
 * @property {string} id
 * @property {string} name
 * @property {string} small
 * @property {string} medium
 * @property {string} large
 */

/**
 * @typedef {{
 * playlist_id: string,
 * track_ids?: string[],
 * tracks?: {id: string, added_at: string}[]
 * }} PlaylistTracks
 */
