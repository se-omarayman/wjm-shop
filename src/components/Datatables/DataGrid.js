import PropTypes from "prop-types";

// material
import { DataGrid, enUS, arSD } from "@mui/x-data-grid";
// @mui
import { LinearProgress } from "@mui/material";
// i18n
import { injectIntl } from "react-intl";
// component
import QuickSearchToolbar from "./QuickSearchToolbar";

// ----------------------------------------------------------------------

function CustomLinearProgress() {
  return <LinearProgress color="info" variant="determinate" />;
}

// ----------------------------------------------------------------------

function CustomDataGrid({
  intl,
  fetcher,
  columns,
  resources,
  searchInput,
  QuickSearchToolbarButtons,
  sortModel,
}) {
  return (
    <DataGrid
      rows={resources.data}
      rowCount={resources.total}
      logLevel={false}
      pageSize={resources.perPage}
      paginationMode="server"
      rowsPerPageOptions={[5, 10, 15, 30]}
      sortingMode="server"
      columns={columns}
      autoHeight={true}
      stickyHeader={true}
      disableColumnMenu={true}
      loading={resources.isLoading}
      filterMode="server"
      initialState={{
        sorting: { sortModel },
      }}
      components={{
        Toolbar: QuickSearchToolbar,
        LoadingOverlay: CustomLinearProgress,
      }}
      componentsProps={{
        toolbar: { fetcher, resources, searchInput, QuickSearchToolbarButtons },
      }}
      localeText={
        "ar-SA" === intl.locale
          ? arSD.components.MuiDataGrid.defaultProps.localeText
          : enUS.components.MuiDataGrid.defaultProps.localeText
      }
      sx={{
        border: "none",
      }}
      onPageChange={(page) => fetcher(page, resources.perPage)}
      onPageSizeChange={(pageSize) => fetcher(resources.currentPage, pageSize)}
      onSortModelChange={(model) =>
        model.length > 0
          ? fetcher(resources.currentPage, resources.perPage, {
              // globalSearch: this.state.globalSearch,
              sortColumn: model[0].field,
              sortDirection: model[0].sort,
            })
          : undefined
      }
    />
  );
}

CustomDataGrid.propTypes = {
  intl: PropTypes.object.isRequired,
  fetcher: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  searchInput: PropTypes.object.isRequired,
  QuickSearchToolbarButtons: PropTypes.func,
  sortModel: PropTypes.array.isRequired,
};

// ----------------------------------------------------------------------

export default injectIntl(CustomDataGrid);
