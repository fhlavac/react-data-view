import React, { useMemo } from 'react';
import { Pagination } from '@patternfly/react-core';
import { Table, Tbody, Th, Thead, Tr, Td } from '@patternfly/react-table';
import { useDataViewPagination, useDataViewSelection } from '@patternfly/react-data-view/dist/dynamic/Hooks';
import { BulkSelect, BulkSelectValue } from '@patternfly/react-component-groups/dist/dynamic/BulkSelect';
import { DataView } from '@patternfly/react-data-view/dist/dynamic/DataView';
import { DataViewToolbar } from '@patternfly/react-data-view/dist/dynamic/DataViewToolbar';

const perPageOptions = [
  { title: '5', value: 5 },
  { title: '10', value: 10 }
];

interface Repository {
  name: string;
  branches: string | null;
  prs: string | null;
  workspaces: string;
  lastCommit: string;
}

const repositories: Repository[] = [
  { name: 'one', branches: 'two', prs: 'three', workspaces: 'four', lastCommit: 'five' },
  { name: 'one - 2', branches: null, prs: null, workspaces: 'four - 2', lastCommit: 'five - 2' },
  { name: 'one - 3', branches: 'two - 3', prs: 'three - 3', workspaces: 'four - 3', lastCommit: 'five - 3' },
  { name: 'one - 4', branches: 'two - 4', prs: 'null', workspaces: 'four - 4', lastCommit: 'five - 4' },
  { name: 'one - 5', branches: 'two - 5', prs: 'three - 5', workspaces: 'four - 5', lastCommit: 'five - 5' },
  { name: 'one - 6', branches: 'two - 6', prs: 'three - 6', workspaces: 'four - 6', lastCommit: 'five - 6' }
];

const cols = {
  name: 'Repositories',
  branches: 'Branches',
  prs: 'Pull requests',
  workspaces: 'Workspaces',
  lastCommit: 'Last commit'
};

const ouiaId = 'LayoutExample';

export const BasicExample: React.FunctionComponent = () => { 
  const pagination = useDataViewPagination({ perPage: 5 });
  const { page, perPage } = pagination;
  const selection = useDataViewSelection({});
  const { selected, onSelect, isSelected } = selection;

  const pageData = useMemo(() => repositories.slice((page - 1) * perPage, ((page - 1) * perPage) + perPage), [ page, perPage ]);

  const handleBulkSelect = (value: BulkSelectValue) => {
    value === BulkSelectValue.none && onSelect(false);
    value === BulkSelectValue.all && onSelect(true, repositories);
    value === BulkSelectValue.nonePage && onSelect(false, pageData);
    value === BulkSelectValue.page && onSelect(true, pageData);
  };

  return (
    <DataView>
      <DataViewToolbar 
        ouiaId='LayoutExampleHeader' 
        bulkSelect={
          <BulkSelect
            canSelectAll
            pageCount={pageData.length}
            totalCount={repositories.length}
            selectedCount={selected.length}
            pageSelected={pageData.every(item => isSelected(item))}
            pagePartiallySelected={pageData.some(item => isSelected(item)) && !pageData.every(item => isSelected(item))}
            onSelect={handleBulkSelect}
          />
        } 
        pagination={
          <Pagination 
            perPageOptions={perPageOptions} 
            itemCount={repositories.length} 
            {...pagination} 
          />
        } 
      />
      <Table aria-label="Repositories table" ouiaId={ouiaId}>
        <Thead data-ouia-component-id={`${ouiaId}-thead`}>
          <Tr ouiaId={`${ouiaId}-tr-head`}>
            <Th key="row-select"/>
            {Object.values(cols).map((column, index) => (
              <Th key={index} data-ouia-component-id={`${ouiaId}-th-${index}`}>{column}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {pageData.map((repo, rowIndex) => (
            <Tr key={repo.name} ouiaId={`${ouiaId}-tr-${rowIndex}`}>
              <Td
                key={`select-${rowIndex}`}
                select={{
                  rowIndex,
                  onSelect: (_event, isSelecting) => onSelect(isSelecting, repo),
                  isSelected: isSelected(repo),
                  isDisabled: false
                }}
              />
              {Object.keys(cols).map((column, colIndex) => (
                <Td key={colIndex} data-ouia-component-id={`${ouiaId}-td-${rowIndex}-${colIndex}`}>{repo[column]}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <DataViewToolbar
        ouiaId='LayoutExampleFooter'
        pagination={
          <Pagination 
            isCompact  
            perPageOptions={perPageOptions} 
            itemCount={repositories.length} 
            {...pagination} 
          />
        } 
      />
    </DataView>
  );
}