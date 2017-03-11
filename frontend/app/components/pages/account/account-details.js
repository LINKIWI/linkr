import humanize from 'humanize';
import React from 'react';

import InfoTable from '../../info-table';

/**
 * Section of the Account interface for showing metadata about the currently logged in user.
 */
const AccountDetails = ({user}) => {
  const absoluteSignupTime = humanize.date('F j, Y g:i:s A', user.signup_time);
  const relativeSignupTime = humanize.relativeTime(user.signup_time);

  return (
    <div className="margin-huge--bottom">
      <p className="text--section-header">DETAILS</p>
      <p className="text--section-caption margin--bottom">
        Some information about your account.
      </p>

      <InfoTable
        entries={[
          {
            key: 'Username',
            value: user.username
          },
          {
            key: 'Signed up',
            value: `${absoluteSignupTime} (${relativeSignupTime})`
          },
          {
            key: 'Account type',
            value: user.is_admin ? 'Admin' : 'Standard user'
          }
        ]}
      />
    </div>
  );
};

export default AccountDetails;
