import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Truck, Makers } from "../App";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { useForm, Controller, SubmitHandler, Validate } from "react-hook-form";
import { useSnackbar } from "notistack";

interface Props {
  truck?: Truck;
  setTrucks: React.Dispatch<React.SetStateAction<Truck[]>>;
  trucks: Truck[];
}

const FORM_WIDTH = "70%";

const Form: React.FC<Props> = ({ truck, setTrucks, trucks }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Truck>({
    reValidateMode: "onSubmit",
    defaultValues: {
      make: null,
      id: "",
      is_available: false,
      purchase_date: new Date(),
    },
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (truck) {
      setValue("make", truck.make);
      setValue("id", truck.id);
      setValue("is_available", truck.is_available);
      setValue("purchase_date", truck.purchase_date);
    } else {
      setValue("make", null);
      setValue("id", "");
      setValue("is_available", false);
      setValue("purchase_date", new Date());
    }
  }, [truck]);

  const isUnique: Validate<string> = (id) => {
    if (truck) {
      return true;
    }
    return !trucks.find((truck) => truck.id === id);
  };

  const onSubmit: SubmitHandler<Truck> = (t) => {
    if (truck) {
      enqueueSnackbar(`Truck #${t.id} is updated successfully!`, {
        variant: "success",
      });
      setTrucks((prev) => {
        const index = prev.findIndex((item) => item.id === truck.id);
        return [...prev.slice(0, index), t, ...prev.slice(index + 1)];
      });
    } else {
      enqueueSnackbar(`Truck #${t.id} is saved successfully!`, {
        variant: "success",
      });
      setTrucks((prev) => [...prev, t]);
    }
  };

  return (
    <Paper sx={{ height: "30rem" }}>
      <Typography variant="h3" gutterBottom>
        {truck ? "Editing" : "Inserting"}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ width: FORM_WIDTH }}>
            <InputLabel id="make-label">Make</InputLabel>
            <Controller
              name="make"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Select {...field} label="Make">
                  {Object.values(Makers).map((maker) => (
                    <MenuItem key={maker} value={maker}>
                      {maker}
                    </MenuItem>
                  ))}
                </Select>
              )}
              control={control}
            />
            {errors.make && (
              <Typography
                variant="caption"
                sx={{ color: "red", display: "block" }}
              >
                ⚠ Please select a maker.
              </Typography>
            )}
            {/* <Select
              required
              labelId="make-label"
              id="make"
              name="make"
              value={userInput.make}
              onChange={handleChange}
            >
              {Object.values(Makers).map((maker) => (
                <MenuItem key={maker} value={maker}>
                  {maker}
                </MenuItem>
              ))}
            </Select> */}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="id"
            rules={{
              pattern: /^[A-Za-z]{3}[0-9]{3}$/,
              required: true,
              validate: {
                unique: isUnique,
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                sx={{ width: FORM_WIDTH }}
                label="Id"
                variant="outlined"
              />
            )}
            control={control}
          />
          {errors.id && errors.id.type === "pattern" && (
            <Typography
              variant="caption"
              sx={{ color: "red", display: "block" }}
            >
              ⚠ Id should be in the format AAA111, where A is a letter and 1 is
              a digit.
            </Typography>
          )}
          {errors.id && errors.id.type === "unique" && (
            <Typography
              variant="caption"
              sx={{ color: "red", display: "block" }}
            >
              ⚠ This id is occupied, please enter a new id.
            </Typography>
          )}
          {errors.id && errors.id.type === "required" && (
            <Typography
              variant="caption"
              sx={{ color: "red", display: "block" }}
            >
              ⚠ Please enter id.
            </Typography>
          )}
          {/* <TextField
            id="id"
            name="id"
            label="Id"
            variant="filled"
            value={userInput.id}
            onChange={handleChange}
            sx={{ width: FORM_WIDTH }}
          /> */}
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Controller
                name="is_available"
                defaultValue={false}
                render={({ field }) => {
                  return (
                    <Checkbox
                      onChange={(e) => field.onChange(e.target.checked)}
                      checked={field.value}
                    />
                  );
                }}
                control={control}
              />
            }
            labelPlacement="start"
            label="Is available"
          />
        </Grid>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {/* <DesktopDatePicker
              label="Purchase Date"
              inputFormat="MM/dd/yyyy"
              value={userInput.purchase_date}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
            /> */}
            <Controller
              name="purchase_date"
              control={control}
              rules={{ required: true }}
              defaultValue={new Date()}
              render={({ field: { ref, ...rest } }) => (
                <DesktopDatePicker
                  label="purchase_date"
                  inputFormat="yyyy/MM/dd"
                  renderInput={(params) => <TextField {...params} />}
                  {...rest}
                />
              )}
            />
            {errors.purchase_date && (
              <Typography
                variant="caption"
                sx={{ color: "red", display: "block" }}
              >
                Please select a purchase date.
              </Typography>
            )}
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Form;
