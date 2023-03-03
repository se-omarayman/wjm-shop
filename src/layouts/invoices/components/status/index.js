import PropTypes from "prop-types";
import React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";

export default function SplitButton({ model, options, fresh, cancelled, delivered, handleUpdate }) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(fresh ? 0 : delivered ? 1 : 2);

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);

    handleUpdate(index, model);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup size="small" color="success" variant="contained" ref={anchorRef}>
        <Button onClick={handleToggle}>{options[selectedIndex]}</Button>

        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>

      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={`${model.id}-${option}`}
                      selected={
                        (index === 0 && fresh) ||
                        (index === 1 && delivered) ||
                        (index === 2 && cancelled)
                      }
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}

SplitButton.propTypes = {
  model: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  fresh: PropTypes.bool.isRequired,
  delivered: PropTypes.bool.isRequired,
  cancelled: PropTypes.bool.isRequired,
  handleUpdate: PropTypes.func.isRequired,
};
