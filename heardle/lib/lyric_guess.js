import { useEffect, useState } from "react";

export default function Lyric_Guess() {

    const [guessed, setGuessed] = useState(false);
    const [lyricGuess, setLyricGuess] = useState('');
    const [lyricAnswer, setLyricAnswer] = useState('');

    useEffect(() => {

        console.log(lyricGuess);

        if (lyricGuess != '') {
            let data = JSON.parse(window.localStorage.getItem("GUESS_DATA"));

            data.last_completed = new Date();
            data.guesses.lyrics = lyricGuess;
            data.game_status = "completed";

            if (lyricGuess.toLowerCase() === lyricAnswer.toLowerCase()) {
                data.score.correct_lyric_guess++;
            }

            window.localStorage.setItem("GUESS_DATA", JSON.stringify(data));
        }
        //want to update correct_lyric_guess
        //guesses.lyrics
        //last completed
        //game progress

    }, [lyricGuess])




    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);


        // You can pass formData as a fetch body directly:
        // fetch('/some-api', { method: form.method, body: formData });

        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries());
        // console.log(formJson.lyricGuess);

        setGuessed(true);
        setLyricGuess(formJson.lyricGuess);
    }


    useEffect(() => {
        let answer = JSON.parse(window.localStorage.getItem('GAME_DATA'));

        setLyricAnswer(answer.data.lyrics_answer);

        let guessData = JSON.parse(window.localStorage.getItem('GUESS_DATA'))
        let today = new Date();
        today.setHours(0,0,0,0);

        if (guessData.game_status === "completed") {
            setGuessed(true);
            setLyricGuess(guessData.guesses.lyrics);
        }
    }, [])

    // !!!!! set guesses in local storage to '' after completion, or new day 
    // update completed date to current date


    return (
        <div>
            {!guessed ? <form onSubmit={handleSubmit}>
                <label>
                    Guess lyric:
                    <label>
                        Text input: <input name="lyricGuess" />
                    </label>
                </label>
                <button type="submit"> Submit</button>

            </form> :
                <div>

                    <Compare lyricGuessed={lyricGuess} answer={lyricAnswer} />
                    <Finalize lyricGuess={lyricGuess.lyricGuess} />
                </div>
            }
        </div>
    )
}


function Compare({ lyricGuessed, answer }) {
    return (
        <div>
            <p>
                You guessed: {lyricGuessed}
            </p>
            The correct lyric is: {answer}
        </div>
    )


}



function Finalize({ }) {


    return (
        <div>
            <button>I think I was close enough</button>
        </div>
    )
}


