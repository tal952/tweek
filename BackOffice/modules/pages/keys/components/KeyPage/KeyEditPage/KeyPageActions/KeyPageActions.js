import React from 'react';
import style from './KeyPageActions.css';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import * as keysActions from '../../../../ducks/selectedKey';
import { deleteKey } from '../../../../ducks/keys';
import { diff } from 'deep-diff';

const DeleteButton = ({isSaving, selectedKey}) => (
  <button disabled={isSaving}
    className={style['delete-key-button']}
    onClick={() => {
      if (confirm('Are you sure?')) {
        deleteKey(selectedKey.key);
      }
    } }>Delete key</button>
);

const SaveButton = ({selectedKey, isSaving, hasChanges}) => (
  <button disabled={!hasChanges || isSaving}
    data-state-has-changes={hasChanges}
    data-state-is-saving={isSaving}
    className={style['save-changes-button']}
    onClick={() => saveKey(selectedKey.key)}>
    {isSaving ? 'Saving...' : 'Save changes'}
  </button>
);

const comp = compose(
  connect(
    state => ({ selectedKey: state.selectedKey }),
    { ...keysActions, deleteKey })
)(
  ({ selectedKey, isInAddMode, saveKey, deleteKey, isReadonly }) => {
    const { local, remote, isSaving, isDeleting } = selectedKey;
    const changes = diff(local, remote);
    const hasChanges = (changes || []).length > 0;

    return (
      <div>
        {isReadonly ?
          <div className={style['readonly-key-message']}>This key is readonly</div>
          : null}
        <div className={style['key-action-buttons-wrapper']}>
          {!isInAddMode ?
            <DeleteButton isSaving={isSaving}
              selectedKey={selectedKey} />
            : null}
          <SaveButton selectedKey={selectedKey}
            isSaving={isSaving}
            hasChanges={hasChanges} />
        </div>
      </div>
    );
  });

export default comp;
