// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import musicData from 'music_data.json';

export default function handler(req, res) {
    //id is the index of the song we are requesting from the json file
    const { id } = req.query;

    console.log("id: " + id);
    const fetchMusic = async () => {
        //TODO: Figure this out wtf
        const response = await fetch(`http://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${musicData[id].Track_Name}&q_artist=${musicData[id].Artist_Name}&apikey=${process.env.MUSIXMATCH_CLIENT_ID}`, {
          method: "GET",
        }
        );

        console.log("music name: " + musicData[id].Track_Name + " artist: " + musicData[id].Artist_Name);
    
        const json = await response.json();
        // setLyrics(json.message.body.lyrics.lyrics_body);
        console.log(json.message.body.lyrics.lyrics_body);
    
        res.status(200).json({ data: json });
      };
    
      fetchMusic();
  }

