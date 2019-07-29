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
      // console.log('demographics==>', demographicsResult[0].Dob);
      // console.log('patientDetails==>', patientDetailsResult[0].Email);
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
          },
          demographics: {...demographics[0]}
        }
      ));

      if (patientDetails.length == 0) {
        throw new Error(`Patient id doesn't Exists!`);
      }
      else {
        return {
          patientDetails: patientDetails
        };
      }
    }
    catch (err) {
      return {
        error: true,
        message: err.message
      }
    }

  }
};
