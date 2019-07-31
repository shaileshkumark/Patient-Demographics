'use strict';
const marital = {
  'um': 'UNMARRIED',
  'm': 'MARRIEED'
};

module.exports = function (PatientDemographics) {

  /**
   * Getting patient demographics details by their id
   */
  PatientDemographics.getDemographicsById = async (id) => {
    try {

      let loopback = require('loopback');
      let Patients = loopback.getModel('Patients');
      let patientDetailsResult = await Patients.find({ where: { PatientId: id } });
      let demographicsResult = await PatientDemographics.find({ where: { PatientId: id } });
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
          patientDetails: patientDetail
        };
      }
    }
    catch (err) {
      console.log('error=>', err);
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

      let patientDetails = patientDetailsResult.map(patientDetails => (
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
          }
        }));

      //var result = patientDetails;
      //console.log('result=>', result);

      let demographics = demographicsResult.map(demographics => (
        {
          id: demographics.PatientId,
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
     patientDetails.map(patient => {patient.demographics = demographics.find(demo => demo.id == patient.id)});



      if (patientDetails.length == 0) {
        throw new Error(`Patients doesn't Exists!`);
      }
      else {

        return patientDetails;
      };
    }
    catch (err) {
      console.log('err=>', err)
      return {
        error: true,
        message: err.message
      }
    }

  }
};
