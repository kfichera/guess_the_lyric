import { useEffect, useState } from "react";
import musicData from "../json/music_names.json"
import styles from "../src/styles/Search.module.css"


export default function Search() {

    const [guess, setGuess] = useState('');

    const [guessed, setGuessed] = useState(false);
    const [answer, setAnswer] = useState('');

    useEffect(() => {
        //get the answer
        let data = JSON.parse(window.localStorage.getItem("GAME_DATA"));
        let titleName = data.data.song_name.concat([" - "]);
        titleName = titleName.concat(data.data.artist_name);
        setAnswer(titleName);

        //check if guessed today, this will be null in the beginnning of the day through index.js
        let guessData = JSON.parse(window.localStorage.getItem("GUESS_DATA"));
        if (guessData.guesses.song_guess_time != null) {
            setGuessed(true);
            setGuess(guessData.guesses.song_name_title);
        }
    }, [])

    //when the user makes a song guess, it will update the local storage
    useEffect(() => {
        //don't update when first starting program
        if (guess !== '') {

            let data = JSON.parse(window.localStorage.getItem("GUESS_DATA"));

            if (data.game_status == "not_started") {
                //set new data 
                data.game_status = "in_progress";
                data.guesses.song_name_title = guess;
                data.guesses.song_guess_time = new Date();
                data.last_played = new Date();

                if (guess === answer) {
                    data.score.correct_title_guess++;
                }

                //set the new data
                window.localStorage.setItem("GUESS_DATA", JSON.stringify(data));
            }
        }

    }, [guess])



    //different cases (search only):
    // 1. has not played ever, or has not played today -> display search
    // 2. has played today and already guessed song -> display guess & correctness

    //if already guessed today, display the guess the user had
    //if not guessed today then display the text box

    return (

        <div>
            {!guessed ? <SearchTitle setGuess={setGuess} setGuessed={setGuessed} /> :
                <CompletedGuess guess={guess} answer={answer} />
            }

        </div>
    )


}
/**
 * Checks the local storage if the user has played today
 * 
 * @param {*} guesses guesses object
 * @returns true if the player has not guessed a song yet. false if they have
 */
function canPlayToday(guesses) {

    //current date - guess
    //if positive then they have not guessed today
    //if negative they have guessed today

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let difference = today - guesses.guesses.song_guess_time;

    console.log(difference);

    return (difference >= 0);

    //
}

/**
 * Display the guess the user made and the answer
 * 
 * @param {*} guess the guess the user made
 * @param {*} answer the song title and artist answer
 * @returns 
 */
function CompletedGuess({ guess, answer }) {

    return (
        <div>
            <p>
                You guessed: {guess}
            </p>
            <p>the correct anser is: {answer}</p>

        </div>
    )

}

function SearchTitle({ setGuess, setGuessed, updateScore }) {

    const [filteredData, setFilteredData] = useState([]);

    const handleSearch = (event) => {
        let value = event.target.value.toLowerCase();
        let result = [];
        result = musicData.filter((data) => {
            // console.log(data);
            return data.Name.toLowerCase().search(value) != -1;
        });
        setFilteredData(result);
    }



    //add a hint button
    //when the guess is completed update the local storage
    //when hint button is pressed, update the local storage & display the song


    return (
      
            <div class={styles.test}>
                <div class={styles.search}>
                    <div>
                        Search: <input type="text" class={styles.searchBar} onChange={(event) => handleSearch(event)} />
                        {/* <button name="hint" onClick={handleHintClick(setGuess, setGuessed)}>Give me a hint!</button> */}
                    </div>
                    {filteredData.map((data, index) => {
                        return (
                            <button class={styles.songName} key={data.key} value={data.Name} onClick={(event) => { handleClick(event, setGuess, setGuessed) }}> {data.Name} </button>
                        )
                    })}
                </div>
            </div>

    )

}

const handleClick = (e, setData, setGuessed) => {

    setData(e.target.value);
    setGuessed(true);

};

