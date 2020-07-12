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
 * @typedef {object} ParsedPlaylist
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} snapshot_id
 * @property {number} track_count
 */
/**
 * @typedef {object} PlaylistTracks
 * @property {string} playlist_id
 * @property {string[]=} track_ids
 * @property {{id: string; added_at: string}[]=} tracks
 */