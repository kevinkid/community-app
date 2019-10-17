/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * Registrants tab component.
 */

import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { config } from 'topcoder-react-utils';

import CheckMark from '../icons/check-mark.svg';
import './style.scss';

function formatDate(date) {
  if (!date) return '-';
  return moment(date).format('MMM DD, YYYY HH:mm');
}

function getDate(arr, handle) {
  const results = arr.filter(a => _.toString(a.submitter || a.handle) === _.toString(handle))
    .sort((a, b) => new Date(b.submissionTime || b.submissionDate).getTime()
      - new Date(a.submissionTime || a.submissionDate).getTime());
  return results[0] ? (results[0].submissionTime || results[0].submissionDate) : '';
}

function passedCheckpoint(checkpoints, handle, results) {
  const mine = checkpoints.filter(c => _.toString(c.submitter) === _.toString(handle));
  return _.some(mine, m => _.find(results, r => r.submissionId === m.submissionId));
}

function getPlace(results, handle, places) {
  const found = _.find(results, w => _.toString(w.handle) === _.toString(handle)
    && w.placement <= places && w.submissionStatus !== 'Failed Review');

  if (found) {
    return found.placement;
  }
  return -1;
}

export default function Registrants({ challenge, checkpointResults, results }) {
  const {
    prizes,
    registrants,
  } = challenge;

  const checkpoints = challenge.checkpoints || [];

  const twoRounds = challenge.round1Introduction
    && challenge.round2Introduction;
  const places = prizes.length;

  const checkpointPhase = challenge.allPhases.find(x => x.phaseType === 'Checkpoint Submission');
  const checkpointDate = moment(checkpointPhase
    ? checkpointPhase.actualEndTime || checkpointPhase.scheduledEndTime : 0);

  registrants.sort((a, b) => new Date(a.registrationDate).getTime()
    - new Date(b.registrationDate).getTime());

  return (
    <div styleName={`container ${twoRounds ? 'design' : ''}`} role="table" aria-label="Registrants">
      <div styleName="head" role="row">
        <div styleName="col-1">
          <span role="columnheader">Username</span>
        </div>
        <div styleName="col-2">
          <span role="columnheader">Registration Date</span>
        </div>
        {twoRounds && (
        <div styleName="col-3">
          <span role="columnheader">Round 1 Submitted Date</span>
        </div>
        )}
        <div styleName="col-4">
          <span role="columnheader">{twoRounds ? 'Round 2 Submitted Date' : 'Submitted Date'}</span>
        </div>
      </div>
      <div styleName="body" role="rowgroup">
        {
          registrants.map((r) => {
            const placement = getPlace(results, r.handle, places);
            const colorStyle = JSON.parse(r.colorStyle.replace(/(\w+):\s*([^;]*)/g, '{"$1": "$2"}'));

            let checkpoint;
            if (twoRounds) {
              checkpoint = getDate(checkpoints, r.handle);
              if (!checkpoint
              && moment(r.submissionDate).isBefore(checkpointDate)) {
                checkpoint = r.submissionDate;
              }
              checkpoint = formatDate(checkpoint);
            }

            let final = '-';
            if (moment(r.submissionDate).isAfter(checkpointDate)) {
              final = formatDate(r.submissionDate);
            }

            return (
              <div styleName="row" key={r.handle} role="row">
                <div styleName="col-1">
                  <span role="cell">
                    <a href={`${config.URL.BASE}/members/${r.handle}`} style={colorStyle}>
                      {r.handle}
                    </a>
                  </span>
                </div>
                <div styleName="col-2">
                  <div styleName="sm-only title">
Registration Date
                  </div>
                  <span role="cell">{formatDate(r.registrationDate)}</span>
                </div>
                {
                  twoRounds
                  && (
                  <div styleName="col-3">
                    <div styleName="sm-only title">
Round 1 Submitted Date
                    </div>
                    <div>
                      <span role="cell">
                        {checkpoint}
                      </span>
                      {
                        passedCheckpoint(checkpoints, r.handle, checkpointResults)
                        && <CheckMark styleName="passed" />
                      }
                    </div>
                  </div>
                  )
                }
                <div styleName="col-4">
                  <div styleName="sm-only title">
                    {twoRounds ? 'Round 2 ' : ''}
Submitted Date
                  </div>
                  <div>
                    <span role="cell">
                      {final}
                    </span>
                    {placement > 0 && (
                    <span role="cell" styleName={`placement ${placement < 4 ? `placement-${placement}` : ''}`}>
                      {placement}
                    </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

Registrants.defaultProps = {
  results: [],
  checkpointResults: {},
};

Registrants.propTypes = {
  challenge: PT.shape({
    allPhases: PT.arrayOf(PT.shape({
      actualEndTime: PT.string,
      phaseType: PT.string.isRequired,
      scheduledEndTime: PT.string,
    })).isRequired,
    checkpoints: PT.arrayOf(PT.shape()),
    prizes: PT.arrayOf(PT.number).isRequired,
    registrants: PT.arrayOf(PT.shape()).isRequired,
    round1Introduction: PT.string,
    round2Introduction: PT.string,
  }).isRequired,
  results: PT.arrayOf(PT.shape()),
  checkpointResults: PT.shape(),
};
