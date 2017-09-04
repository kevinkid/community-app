// TODO: All uses of this component MUST be replaced by Avatar component!

import Avatar from 'components/Avatar';
import config from 'utils/config';
import React, { Component } from 'react';
import PT from 'prop-types';
import './style.scss';

/* TODO: Should be functional component! */
class LeaderboardAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      member: props.member,
    };
  }

  render() {
    const { openNewTab, plusOne, url } = this.props;
    const { member } = this.state;
    const targetURL = url || `${config.URL.BASE}/members/${member.handle}`;
    let photoURL = member.photoURL;
    if (photoURL && !photoURL.startsWith('http')) {
      photoURL = `${config.URL.BASE}/${photoURL}`;
    }
    return (
      <a
        href={targetURL}
        styleName={`leaderboard-avatar ${member.position || member.isSmr ? '' : 'light-gray'}`}
        target={openNewTab ? '_blank' : undefined}
      >
        { plusOne ? '+1' : <Avatar url={photoURL} />}
        <span styleName={member.position ? `placement placement-${member.position}` : 'hidden'}>
          {member.position}
        </span>
      </a>
    );
  }
}

LeaderboardAvatar.defaultProps = {
  member: {},
  openNewTab: false,
  plusOne: false,
  url: '',
};

LeaderboardAvatar.propTypes = {
  member: PT.shape({}),
  openNewTab: PT.bool,
  plusOne: PT.bool,
  url: PT.string,
};

export default LeaderboardAvatar;
