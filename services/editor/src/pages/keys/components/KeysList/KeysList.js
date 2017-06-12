import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Observable } from 'rxjs/Rx';
import { componentFromStream, createEventHandler } from 'recompose';
import * as SearchService from '../../../../services/search-service';
import DirectoryTreeView from './DirectoryTreeView';
import './KeysList.css';

function KeysFilter({ onFilterChange }) {
  return (
    <div className={'search-input-wrapper'}>
      <input
        type="text"
        className={'search-input'}
        placeholder="Search..."
        onKeyUp={e => onFilterChange(e.target.value)}
      />
    </div>
  );
}

const KeyItem = connect((state, props) => ({
  isActive: state.selectedKey && state.selectedKey.key && state.selectedKey.key === props.fullPath,
}))(({ name, fullPath, depth, isActive }) =>
  <div className={classNames('key-link-wrapper')}>
    <Link
      className={classNames('key-link', { selected: isActive })}
      style={{ paddingLeft: (depth + 1) * 14 }}
      to={`/keys/${fullPath}`}
    >
      {name}
    </Link>
  </div>,
);

const KeysList = componentFromStream((prop$) => {
  const keyList$ = prop$.map(x => x.keys).distinctUntilChanged();

  const { handler: setFilter, stream: filter$ } = createEventHandler();
  const filteredKeys$ = filter$
    .map(x => x.trim())
    .distinctUntilChanged()
    .debounceTime(500)
    .startWith('')
    .switchMap(async filter => (filter === '' ? undefined : SearchService.search(filter)));

  return Observable.combineLatest(filteredKeys$, keyList$).map(([filteredKeys, keys]) =>
    <div className={'keys-list-container'}>
      <KeysFilter onFilterChange={setFilter} />
      <DirectoryTreeView
        paths={filteredKeys || keys}
        renderItem={KeyItem}
        expandByDefault={!!filteredKeys}
      />
    </div>,
  );
});

export default KeysList;
