import { useEffect } from 'react';
import I18nPage from './I18nPage.jsx';
import classnames from 'classnames';
import useGame from '../hooks/useGame.ts';
import { SCORE_TARGET } from '../lib/gameRules.ts';
import './Quiz.css';

function Quiz({ messages, params: { gameType, quizType }, location: { pathname }, navigate }) {
  const {
    timer, scores, status, quiz: { enemy, options }, overlay, result, start, answer
  } = useGame(gameType, quizType);

  useEffect(() => {
    if (result !== null) navigate(`${pathname}/result/${result}`);
  }, [result, navigate, pathname]);

  const { TIMER, SCORES, GOAL, GOAL_BASIC, GOAL_SPEEDRUN } = messages;

  const overlayDiv = (
    <div className="overlay" onClick={start}>
      <h2>{GOAL}</h2>
      <span>{gameType === 'basic' ? GOAL_BASIC : GOAL_SPEEDRUN.replace('{scoreTarget}', SCORE_TARGET)}</span>
    </div>
  );

  return (
    <div className="Quiz">
      {overlay ? overlayDiv : null}
      <div className={`stemContainer Bgc-${enemy.type}`}>
        <div className="stemHeader">
          <div className="stemTimer">{TIMER}: {timer}</div>
          <div className="stemScores">{SCORES}: {scores}</div>
        </div>
        <div className="stemEnemy">
          <div className="stemEnemyText">{messages[enemy.title]}<br/>( {messages[enemy.type.toUpperCase()]} )</div>
        </div>
        <div className="stemStatus">{messages[status]}</div>
      </div>
      <div className="optionContainer">
        {options.map((option, index) => {
          const { type, damage, clicked, correct } = option;
          const optionClass = classnames('optionItem', {
            [`Bgc-${type}`]: !clicked || correct,
            'Bgc-wrong': clicked && !correct
          });
          return (
            <div key={type + index}
              className={optionClass}
              onClick={() => answer(index)}>
              <div className="optionText">
                {messages[type.toUpperCase()]}
                {clicked ? <div className="optionDamage">{damage}</div> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default I18nPage(function QuizRoute(props) {
  return <Quiz key={props.location.pathname} {...props} />;
});
