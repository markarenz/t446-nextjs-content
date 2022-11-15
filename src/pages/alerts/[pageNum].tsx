import { useState } from 'react';
import Router from 'next/router';
import type { NextPage, GetServerSideProps } from 'next';
import Layout from '../../components/Layout';
import { Alert } from '../../types/types';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import PageDataTable from '../../components/common/PageDataTable';
import PaginationNav from '../../components/common/PaginationNav';
import { useAppContext } from '../../context/AppContext';
import PageDataHeader from '../../components/common/PageDataHeader';
import { callCreateNew, callDelete, callPublish } from '../../helpers/alerts';
import { getItemsAlerts } from '../../utility/db/queries/alerts';
import styles from '../../styles/modules/Dashboard.module.scss';

type Props = {
  alerts: Alert[];
  pageNum: number;
  itemsPerPage: number;
  numItems: number;
  defaultSearchText: string;
};

const Alerts: NextPage<Props> = ({
  alerts,
  pageNum,
  itemsPerPage,
  numItems,
  defaultSearchText
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Alert | null>(null);
  const { setLoading } = useAppContext();
  const pageMeta = {
    title: 'Alerts',
    metedesc: 'This page holds a list of alerts for the T446 website.'
  };

  const handleDelete = (alert: Alert): void => {
    setIsConfirmingDelete(true);
    setSelectedItem(alert);
  };
  const handleDeleteCancel = (): void => {
    setIsConfirmingDelete(false);
  };
  const handleDeleteOk = async () => {
    await callDelete(setLoading, setIsConfirmingDelete, `${selectedItem?.id}`);
  };
  const setSearchFilter = (searchText: string) => {
    Router.replace(`/alerts/1?search=${encodeURIComponent(searchText)}`);
  };
  const handleCreateNew = async () => {
    callCreateNew(setLoading);
  };
  const handlePublish = async () => {
    callPublish(setLoading);
  };
  const tableActions = ['edit', 'delete'];
  const tableFields = [
    {
      title: 'Title',
      slug: 'title'
    },
    {
      title: 'Status',
      slug: 'status'
    }
  ];
  return (
    <Layout pageMeta={pageMeta}>
      <div className={styles.pageRoot}>
        <div className="container-xl">
          <PageDataHeader
            title="Alerts"
            setSearchFilter={setSearchFilter}
            defaultSearchText={defaultSearchText}
            handleCreateNew={handleCreateNew}
            handlePublish={handlePublish}
          />
          <PageDataTable
            items={alerts}
            slug="alerts"
            tableFields={tableFields}
            tableActions={tableActions}
            handleDelete={handleDelete}
          />
          <PaginationNav
            pageNum={pageNum}
            itemsPerPage={itemsPerPage}
            itemsLoaded={alerts.length}
            numItems={numItems}
            path="/alerts/"
          />
        </div>
        {isConfirmingDelete && (
          <ConfirmationModal
            title="Delete Alert"
            handleCancel={handleDeleteCancel}
            handleOk={() => handleDeleteOk()}
          >
            <span>Are you sure you want to delete this item?</span>
          </ConfirmationModal>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pageNum: pageNumStr, search } = context.query;
  const pageNum = parseFloat(`${pageNumStr}`);
  const itemsPerPage = 10;
  const skip = (pageNum - 1) * itemsPerPage;
  const searchText = search === undefined ? '' : `${search}`;
  const { numItems, alerts } = await getItemsAlerts(
    searchText,
    skip,
    itemsPerPage
  );
  return {
    props: {
      alerts,
      pageNum,
      itemsPerPage,
      numItems,
      defaultSearchText: searchText
    }
  };
};

export default Alerts;
