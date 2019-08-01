//'use strict';
const marital = {
  'um': 'UNMARRIED',
  'm': 'MARRIEED'
};

module.exports = function (PatientDemographics) {

  /**
   * Getting patient demographics details by their id
   */

  PatientDemographics.getDemographicsById = async (id,id1) => {
    try {
        let loopback = require('loopback');
        let Patients = loopback.getModel('Patients');


    let patientDetailsResult = await Patients.find({ value:{ PatientId:id}} );
        let demographicsResult = await PatientDemographics.find({ where: { PatientId: id} });
        let demographics = demographicsResult.map(demographics => (
          {
            dateOfBirth: demographics.Dob,
            age: demographics.Age,
            gender: demographics.Gender,
            maritalStatus: marital[demographics.MaritalStatus],
            bloodGroup: demographics.BloodGroup,
            created: {
              by: demographics.CreateBy,
              on: demographics.CreateDate
            },
            modify: {
              by: demographics.ModifyBy,
              on: demographics.ModifyDate
            }
          }
        ));
        let patientDetail = patientDetailsResult.map(patientDetails => (
          {
            id: patientDetails.PatientId,
            email: patientDetails.Email,
            name: {
              first: patientDetails.FirstName,
              last: patientDetails.LastName
            },
            createOn: patientDetails.CreateDate,
            modify: {
              by: patientDetails.ModifyBy,
              on: patientDetails.ModifyDate
            },
            demographics: { ...demographics[0] }

          }
        ));

        if (patientDetail.length == 0) {
          throw new Error(`Patient id doesn't Exists!`);
        }
        else {

        return {
          patientDetail:patientDetail
      }
    }
  }
  

    catch (err) {
      return {
        error: true,
        message: err.message
      }
    }
  }
  

  /**
   * Get all patients demographics
   */

  PatientDemographics.GetDemographics = async () => {
    try {

      let loopback = require('loopback');
      let Patients = loopback.getModel('Patients');
      let patientDetailsResult = await Patients.find();
      let demographicsResult = await PatientDemographics.find();

      let patientDetails = patientDetailsResult.map(patient => {
        let demography = demographicsResult.find(demo => demo.PatientId == patient.PatientId);

        return {
          id: patient.PatientId,
          email: patient.Email,
          name: {
            first: patient.FirstName,
            last: patient.LastName
          },
          demography: demography ? {
            dob: demography.Dob ? demography.Dob.toISOString().slice(0, 10) : null,
            age: demography.Age ? demography.Age : null,
            gender: demography.Age ? demography.Gender : null,
            maritalStatus: demography.MaritalStatus ? marital[demography.MaritalStatus] : null,
            bloodGroup: demography.BloodGroup ? demography.BloodGroup : null,
            demographyCreated: {
              on: demography.CreateDate.toISOString().slice(0, 10),
              by: demography.CreateBy ? demography.CreateBy : null
            }
          } : {},
          createOn: patient.CreateDate.toISOString().slice(0, 10),
          modify: {
            by: patient.ModifyBy ? patient.ModifyBy : null,
            on: patient.ModifyDate ? patient.ModifyDate.toISOString().slice(0, 10) : null
          }
        }
      });
      if (patientDetailsResult.length == 0) {
        throw new Error(`Patients doesn't Exists!`);
      }
      else {
        return patientDetails;
      };
    }
    catch (err) {
      return {
        error: true,
        message: err.message
      }
    }

  }
};
