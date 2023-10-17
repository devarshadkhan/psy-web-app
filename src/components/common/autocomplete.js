import { useRef, useEffect } from "react";
import styles from "@/styles/components/common/Autocomplete.module.css";
import hometyles from "@/styles/Home.module.css";
import { usePlacesWidget } from "react-google-autocomplete";

const GoogleKey = process.env.GOOGLE_KEY;

const AutoComplete = ({
  updateAddress,
  showLabel = true,
  isAddress = true,
  UpdateCity,
  errors,
  isRequired = true,
  register,
  location,
  setValue,
}) => {

  const { ref } = usePlacesWidget({
    apiKey: process.env.GOOGLE_KEY,
    onPlaceSelected: (place) => {
      let cityVal = place?.formatted_address?.split(",")[0];
      ref.current.value = cityVal;
      if (isAddress) {
        updateAddress(place);
      } else {
        UpdateCity(cityVal);
      }
      setValue("city", cityVal, { shouldValidate: true });
    },
  });

  // useEffect(() => {
  //   if (window?.google?.maps?.places) {
  //     autoCompleteRef.current = new window.google.maps.places.Autocomplete(
  //       inputRef.current,
  //       options
  //     );
  //   }
  //   autoCompleteRef.current.addListener("place_changed", async function () {
  //     const place = await autoCompleteRef.current.getPlace();
  //     if (place) {
  //       let cityVal = place.formatted_address.split(",")[0];
  //       inputRef.current.value = cityVal;
  //       if (isAddress) {
  //         updateAddress(place);
  //       } else {
  //         UpdateCity(cityVal);
  //       }
  //       setValue("city", cityVal, { shouldValidate: true });
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (location) {
      ref.current.value = location.trim();
      setValue("city", location.trim());
    }
  }, [location]);

  return (
    <div className="form-floating mb-4">
      <input
        type="text"
        className={`${hometyles.greyInputBg} ${
          errors.city && styles.invalid
        } w-100 form-control`}
        id="floatingInputCity"
        placeholder="City"
        ref={ref}
      />
      <input type={"hidden"} {...register("city", { required: isRequired })} />
      {showLabel && (
        <label htmlFor="floatingInputCity" className={hometyles.floatingLabel}>
          City
        </label>
      )}
      {errors.city && (
        <span className="invalid-feedback">This is required.</span>
      )}
    </div>
  );
};

export default AutoComplete;
