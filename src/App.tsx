import React, { useEffect, useState } from "react";
// import logo from "./logo.svg";
import "./App.css";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "./components/List";
import Form from "./components/Form";
import Button from "@mui/material/Button";
import { SnackbarProvider } from "notistack";

export interface Truck {
  make: Makers | null;
  id: string;
  is_available: boolean;
  purchase_date: Date;
}

export enum Makers {
  Belaz = "Belaz",
  Caterpillar = "Caterpillar",
  Komatsu = "Komatsu",
}

export interface Edit {
  edit: boolean;
  id: string;
}

function App() {
  const local_trucks = localStorage.getItem("trucks");

  const parseTruckDate = (
    trucks: {
      make: Makers;
      id: string;
      is_available: boolean;
      purchase_date: string;
    }[]
  ): Truck[] => {
    return trucks.map((truck) => {
      return {
        ...truck,
        purchase_date: new Date(truck.purchase_date),
      };
    });
  };

  const [trucks, setTrucks] = useState<Truck[]>(
    local_trucks ? parseTruckDate(JSON.parse(local_trucks)) : []
  );
  const [editTruck, setEditTruck] = useState<Edit>({ edit: false, id: "" });

  useEffect(() => {
    localStorage.setItem("trucks", JSON.stringify(trucks));
  }, [trucks]);

  function ensure(
    argument: Truck | undefined | null,
    message: string = "This value was promised to be there."
  ): Truck {
    if (argument === undefined || argument === null) {
      return {
        make: Makers.Belaz,
        id: "abc123",
        is_available: true,
        purchase_date: new Date(),
      };
    }

    return argument;
  }

  return (
    <Box className="App">
      <SnackbarProvider maxSnack={3}>
        <Typography variant="h3">Heavy Truck Inventory</Typography>
        <Button
          variant="contained"
          sx={{ margin: "1rem" }}
          onClick={() => {
            setEditTruck({ edit: false, id: "" });
          }}
        >
          Insert new truck
        </Button>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <List
              trucks={trucks}
              setTrucks={setTrucks}
              setEditTruck={setEditTruck}
            ></List>
          </Grid>
          <Grid item xs={4}>
            {editTruck.edit ? (
              <Form
                truck={ensure(
                  trucks.find((truck) => truck.id === editTruck.id)
                )}
                setTrucks={setTrucks}
                trucks={trucks}
              ></Form>
            ) : (
              <Form setTrucks={setTrucks} trucks={trucks}></Form>
            )}
          </Grid>
        </Grid>
      </SnackbarProvider>
    </Box>
  );
}

export default App;
