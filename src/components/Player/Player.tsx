import { FC } from 'react';

import './Player.scss';

export const Player: FC = () => {
  return (
    <>
      <div className="player">
        <div className="player__cover">
          <img src="assets/img/covers/cover.svg" alt=""/>
        </div>

        <div className="player__content">
          <span className="player__track"><b className="player__title">Epic Cinematic</b> – <span
            className="player__artist">AudioPizza</span></span>
          <audio
            src="https://dmitryvolkov.me/demo/blast2.0/audio/12071151_epic-cinematic-trailer_by_audiopizza_preview.mp3"
            id="audio" controls></audio>
        </div>
      </div>

      <button className="player__btn" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M21.65,2.24a1,1,0,0,0-.8-.23l-13,2A1,1,0,0,0,7,5V15.35A3.45,3.45,0,0,0,5.5,15,3.5,3.5,0,1,0,9,18.5V10.86L20,9.17v4.18A3.45,3.45,0,0,0,18.5,13,3.5,3.5,0,1,0,22,16.5V3A1,1,0,0,0,21.65,2.24ZM5.5,20A1.5,1.5,0,1,1,7,18.5,1.5,1.5,0,0,1,5.5,20Zm13-2A1.5,1.5,0,1,1,20,16.5,1.5,1.5,0,0,1,18.5,18ZM20,7.14,9,8.83v-3L20,4.17Z"/>
        </svg>
        Player
      </button>
    </>
  );
};
