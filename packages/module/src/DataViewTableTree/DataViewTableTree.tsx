import React, { useMemo } from 'react';
import {
  Table,
  TableProps,
  Tbody,
  Td,
  TdProps,
  TreeRowWrapper,
} from '@patternfly/react-table';
import { useInternalContext } from '../InternalContext';
import { DataViewTableHead } from '../DataViewTableHead';
import { DataViewTh, DataViewTrTree, isDataViewTdObject } from '../DataViewTable';
import { DataViewState } from '../DataView/DataView';

const getDescendants = (node: DataViewTrTree): DataViewTrTree[] => (!node.children || !node.children.length) ? [ node ] : node.children.flatMap(getDescendants);

const isNodeChecked = (node: DataViewTrTree, isSelected: (node: DataViewTrTree) => boolean) => {
  let allSelected = true;
  let someSelected = false;

  for (const descendant of getDescendants(node)) {
    const selected = !!isSelected?.(descendant);

    someSelected ||= selected;
    allSelected &&= selected;

    if (!allSelected && someSelected) { return null }
  }

  return allSelected;
};

export interface DataViewTableTreeProps extends Omit<TableProps, 'onSelect' | 'rows'> {
  /** Columns definition */
  columns: DataViewTh[];
  /** Current page rows */
  rows: DataViewTrTree[];
  /** Table head states to be displayed when active */
  headStates?: Partial<Record<DataViewState | string, React.ReactNode>>
  /** Table body states to be displayed when active */
  bodyStates?: Partial<Record<DataViewState | string, React.ReactNode>>
  /** Optional icon for the leaf rows */
  leafIcon?: React.ReactNode;
  /** Optional icon for the expanded parent rows */
  expandedIcon?: React.ReactNode;
  /** Optional icon for the collapsed parent rows */
  collapsedIcon?: React.ReactNode;
  /** Custom OUIA ID */
  ouiaId?: string;
}

export const DataViewTableTree: React.FC<DataViewTableTreeProps> = ({
  columns,
  rows,
  headStates,
  bodyStates,
  leafIcon = null,
  expandedIcon = null,
  collapsedIcon = null,
  ouiaId = 'DataViewTableTree',
  ...props
}: DataViewTableTreeProps) => {
  const { selection, activeState } = useInternalContext();
  const { onSelect, isSelected, isSelectDisabled } = selection ?? {};
  const [ expandedNodeIds, setExpandedNodeIds ] = React.useState<string[]>([]);
  const [ expandedDetailsNodeNames, setExpandedDetailsNodeIds ] = React.useState<string[]>([]);

  const activeHeadState = useMemo(() => activeState ? headStates?.[activeState] : undefined, [ activeState, headStates ]);
  const activeBodyState = useMemo(() => activeState ? bodyStates?.[activeState] : undefined, [ activeState, bodyStates ]);

  const nodes = useMemo(() => {

    const renderRows = (
      [ node, ...remainingNodes ]: DataViewTrTree[],
      level = 1,
      posinset = 1,
      rowIndex = 0,
      isHidden = false
    ): React.ReactNode[] => {
      if (!node) {
        return [];
      }
      const isExpanded = expandedNodeIds.includes(node.id);
      const isDetailsExpanded = expandedDetailsNodeNames.includes(node.id);
      const isChecked = isSelected && isNodeChecked(node, isSelected);
      let icon = leafIcon;
      if (node.children) {
        icon = isExpanded ? expandedIcon : collapsedIcon;
      }

      const treeRow: TdProps['treeRow'] = {
        onCollapse: () =>
          setExpandedNodeIds(prevExpanded => {
            const otherExpandedNodeIds = prevExpanded.filter(id => id !== node.id);
            return isExpanded ? otherExpandedNodeIds : [ ...otherExpandedNodeIds, node.id ];
          }),
        onToggleRowDetails: () =>
          setExpandedDetailsNodeIds(prevDetailsExpanded => {
            const otherDetailsExpandedNodeIds = prevDetailsExpanded.filter(id => id !== node.id);
            return isDetailsExpanded ? otherDetailsExpandedNodeIds : [ ...otherDetailsExpandedNodeIds, node.id ];
          }),
        onCheckChange: (isSelectDisabled?.(node) || !onSelect) ? undefined : (_event, isChecking) => onSelect?.(isChecking, getDescendants(node)),
        rowIndex,
        props: {
          isExpanded,
          isDetailsExpanded,
          isHidden,
          'aria-level': level,
          'aria-posinset': posinset,
          'aria-setsize': node.children?.length ?? 0,
          isChecked,
          checkboxId: `checkbox_id_${node.id?.toLowerCase().replace(/\s+/g, '_')}`,
          icon,
        },
      };

      const childRows = node.children?.length
        ? renderRows(node.children, level + 1, 1, rowIndex + 1, !isExpanded || isHidden)
        : [];

      return [
        <TreeRowWrapper key={node.id} row={{ props: treeRow.props }} ouiaId={`${ouiaId}-tr-${rowIndex}`}>
          {node.row.map((cell, colIndex) => {
            const cellIsObject = isDataViewTdObject(cell);
            return (
              <Td
                key={colIndex}
                treeRow={colIndex === 0 ? treeRow : undefined}
                {...(cellIsObject && (cell?.props ?? {}))}
                data-ouia-component-id={`${ouiaId}-td-${rowIndex}-${colIndex}`}
              >
                {cellIsObject ? cell.cell : cell}
              </Td>
            );
          })}
        </TreeRowWrapper>,
        ...childRows,
        ...renderRows(remainingNodes, level, posinset + 1, rowIndex + 1 + childRows.length, isHidden),
      ];
    };

    return renderRows(rows);
  }, [
    rows,
    expandedNodeIds,
    expandedDetailsNodeNames,
    leafIcon,
    expandedIcon,
    collapsedIcon,
    isSelected,
    onSelect,
    isSelectDisabled,
    ouiaId
  ]);

  return (
    <Table isTreeTable aria-label="Data table" ouiaId={ouiaId} {...props}>
      {activeHeadState || <DataViewTableHead isTreeTable columns={columns} ouiaId={ouiaId} />}
      {activeBodyState || <Tbody>{nodes}</Tbody>}
    </Table>
  );
};

export default DataViewTableTree;
