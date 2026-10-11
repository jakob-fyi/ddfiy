export const LOG_PREFIX = "[DDFIY]";
export const DREIMETADATEN_API_ENDPOINT =
  "https://api.dreimetadaten.de/db.json?sql=select%0D%0A++nummer%2C%0D%0A++titel%2C%0D%0A++urlCoverDreifragezeichen%2C%0D%0A++idSpotify%0D%0AFROM%0D%0A++serie%0D%0A++JOIN+h%C3%B6rspiel+ON+serie.h%C3%B6rspielId+%3D+h%C3%B6rspiel.h%C3%B6rspielId%0D%0A+WHERE%0D%0A++idSpotify+%21%3D+%22%22";
export const RECHECK_INTERVAL = 14;
