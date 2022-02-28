import React, { useState } from "react";
import { Edit, Truck } from "../App";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import { useSnackbar } from "notistack";

interface Props {
  trucks: Truck[];
  setTrucks: React.Dispatch<React.SetStateAction<Truck[]>>;
  setEditTruck: React.Dispatch<React.SetStateAction<Edit>>;
}

interface DeleteConfirmation {
  show: boolean;
  id: string;
}

const List: React.FC<Props> = ({ trucks, setTrucks, setEditTruck }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = (id: string) => {
    enqueueSnackbar(`Truck #${id} is deleted!`, {
      variant: "info",
    });
    setTrucks((prev) => {
      return prev.filter((truck) => truck.id !== id);
    });
  };

  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmation>({ show: false, id: "" });
  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: "30rem" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">Make</TableCell>
              <TableCell align="center">Id</TableCell>
              <TableCell align="center">Is Available</TableCell>
              <TableCell align="center">Purchase Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trucks.map((truck) => {
              return (
                <TableRow
                  key={truck.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{truck.make}</TableCell>
                  <TableCell align="center">{truck.id}</TableCell>
                  <TableCell align="center">
                    {truck.is_available ? "yes" : "no"}
                  </TableCell>
                  <TableCell align="center">
                    {truck.purchase_date?.toISOString().split("T")[0]}
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup
                      variant="contained"
                      aria-label="outlined primary button group"
                    >
                      <Button
                        onClick={(e) => {
                          setEditTruck({ edit: true, id: truck.id });
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={(e) => {
                          setDeleteConfirmation({ show: true, id: truck.id });
                        }}
                      >
                        Delete
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={deleteConfirmation.show}
        onClose={(e) => {
          setDeleteConfirmation({ show: false, id: "" });
        }}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {`Are you sure you want to delete the truck #${deleteConfirmation.id}?`}
        </DialogTitle>
        <DialogActions>
          <Button
            autoFocus
            onClick={(e) => {
              setDeleteConfirmation({ show: false, id: "" });
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={(e) => {
              handleDelete(deleteConfirmation.id);
              setDeleteConfirmation({ show: false, id: "" });
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default List;
