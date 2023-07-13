// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import musicData from '../../../muisc.json';

export default function handler(req, res) {
  // res.status(200).json({ name: 'John Doe' })

  const fetchMusic = async () => {
    //TODO: Figure this out wtf
    const response = await fetch(`http://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${musicData[150].Track_Name}&q_artist=${musicData[150].Artist_Name}&apikey=4290ff500d68899a2ef375d7d2e88f63`, {
      method: "GET",
    }
    );

    const json = await response.json();
    // setLyrics(json.message.body.lyrics.lyrics_body);
    console.log(json.message.body.lyrics.lyrics_body);

    res.status(200).json({ data: json });
  };

  fetchMusic();
}
