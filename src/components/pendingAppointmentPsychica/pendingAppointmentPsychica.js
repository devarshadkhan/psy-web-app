import { explorePsychicData } from "@/store/client/explorepsychic";
import styles from "@/styles/components/appointmentChecklist/AppointmentChecklist.module.css";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { FiFilter } from "react-icons/fi";
import classNames from "classnames";
function PendingAppointmentPsychix({
  setType,
  inputDisabled,
  setInputDisabled,
}) {
  const RenderingNames = {
    STYLES: "Styles",
    TOOLS: "Tools",
    ABILITIES: "Abilities",
    READING_TOPIC: "Reading Topics",
  };

  const dispatch = useDispatch();
  const [exploreData, setExploreData] = useState([]);

  const [list, setList] = useState([]);

  const handleCheck = (id, value) => {
    if (value) {
      const data = [...list];
      data.push(id);
      setList(data);
      setType(data);
    } else {
      setInputDisabled(false);
      let val = [...list];
      val = val.filter((ele) => ele !== id);
      setList(val);
      setType(val);
    }
  };

  useEffect(() => {
    dispatch(explorePsychicData()).then((res) => {
      if (!res.error) {
        setExploreData(res.payload);
      }
    });
  }, []);

  const checked = () => {
    const data = [];
    document
      .getElementsByName("CollapseContainer")
      .forEach((item) => item.classList.add("show"));
    exploreData.forEach((item) =>
      item.list.forEach((element) => data.push(element.name))
    );
    setList(data);
    setType(data);
    if (inputDisabled) {
      setInputDisabled(true);
    } else {
      setInputDisabled(!inputDisabled);
    }
  };

  const unChecked = (id, value) => {
    setInputDisabled(false);
    setList([]);
    setType([]);
  };

  return (
    <>
      {exploreData.map((ele, id) => {
        return (
          <>
            <div className={styles.checklistContainer}>
              <div
                className="d-flex align-items-center gap-3"
                data-bs-toggle="collapse"
                href={`#${ele._id}`}
                role="button"
                aria-expanded="false"
                aria-controls={ele?._id}
              >
                {/* <img src="/images/tag.png" className={styles.hashImg} /> */}
                <FiFilter className={styles.hashImg} />
                <h4>Filter by {RenderingNames[ele?._id]}</h4>
              </div>

              <div name="CollapseContainer" className=" collapse" id={ele?._id}>
                <div
                  key={ele?._id}
                  className=" d-block justify-content-between align-items-center collapse"
                >
                  {ele.list.map((e) => {
                    return (
                      <>
                        <div className="form-check d-flex justify-content-between my-4 ">
                          <label
                            htmlFor={e.checkboxId}
                            className={`${
                              list.includes(e.checkboxId)
                                ? styles.dark
                                : styles.light
                            }  ${styles.listItem}`}
                          >
                            {e?.name}
                          </label>
                          <div className="form-check">
                            <input
                              className={"form-check-input " + styles.checkbox}
                              type="checkbox"
                              value=""
                              onChange={(event) =>
                                handleCheck(e?.name, event.target.checked)
                              }
                              id={e.checkboxId}
                              checked={
                                (inputDisabled || list.includes(e?.name)) &&
                                "checked"
                              }
                            />
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
                {/* );
            })
          : null} */}
              </div>

              <hr style={{ backgroundColor: "#EFEFEF" }} />
            </div>
          </>
        );
      })}

      <div
        className={"d-flex justify-content-between mb-5 " + styles.btnContainer}
      >
        <button className={styles.listBtn} onClick={checked}>
          Select all
        </button>
        <button className={styles.listBtn} onClick={unChecked}>
          Unselect all
        </button>
      </div>

      {/* <div >
  <div className="card card-body">
    Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
  </div>
</div> */}
    </>
  );
}

export default PendingAppointmentPsychix;
