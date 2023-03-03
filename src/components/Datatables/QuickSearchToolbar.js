import PropTypes from "prop-types";
import { useState } from "react";

// material
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";
// icons
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

// ----------------------------------------------------------------------

function QuickSearchToolbar({ fetcher, resources, searchInput, QuickSearchToolbarButtons }) {
  const [showClearResourceGlobalSearchButton, setShowClearResourceGlobalSearchButton] =
    useState(false);

  return (
    <Grid container={true}>
      <Grid item={true} xs={12} md={6} lg={6}>
        {QuickSearchToolbarButtons ? <QuickSearchToolbarButtons /> : null}
      </Grid>

      <Grid item={true} xs={12} md={6} lg={6}>
        <GridToolbarQuickFilter
          as={TextField}
          placeholder=""
          variant="filled"
          id={searchInput.id}
          label={searchInput.label}
          sx={{ mx: 1, my: 3, display: "flex" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    if (!showClearResourceGlobalSearchButton) {
                      const search = document.getElementById(searchInput.id).value.trim();

                      if (search !== "") {
                        setShowClearResourceGlobalSearchButton(true);
                      }

                      fetcher(resources.currentPage, resources.perPage, {
                        globalSearch: search,
                      });
                    } else {
                      fetcher(resources.currentPage, resources.perPage, {
                        sortColumn: "id",
                        sortDirection: "desc",
                      });

                      setShowClearResourceGlobalSearchButton(false);
                    }
                  }}
                  edge="end"
                >
                  {showClearResourceGlobalSearchButton ? <CloseIcon /> : <SearchIcon />}}
                </IconButton>
              </InputAdornment>
            ),
          }}
          onKeyDown={(e) => {
            if (13 === e.keyCode) {
              if (!showClearResourceGlobalSearchButton) {
                const search = e.target.value.trim();

                if (search !== "") {
                  setShowClearResourceGlobalSearchButton(true);
                }

                fetcher(resources.currentPage, resources.perPage, {
                  globalSearch: search,
                });
              } else {
                fetcher(resources.currentPage, resources.perPage, {
                  sortColumn: "id",
                  sortDirection: "desc",
                });

                setShowClearResourceGlobalSearchButton(false);
              }
            }
          }}
        />
      </Grid>
    </Grid>
  );
}

QuickSearchToolbar.propTypes = {
  resources: PropTypes.object.isRequired,
  fetcher: PropTypes.func.isRequired,
  searchInput: PropTypes.object.isRequired,
  QuickSearchToolbarButtons: PropTypes.func,
};

// ----------------------------------------------------------------------

export default QuickSearchToolbar;
