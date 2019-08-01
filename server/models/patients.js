'use strict';


module.exports = function (Patients) {
    /**
     * for Getting all patient details
     */
    Patients.getPatientDemographics = async () => {
        let patients = await Patients.find({
            include: {
                relation: 'patientDemographics',
                scope: {
                    fields: ['Dob', 'Age', 'Gender', 'MaritalStatus', 'BloodGroup', 'CreateDate', 'CreateBy', 'ModifyBy', 'ModifyDate'],
                }
            }
        })
        let patientDetails = patients.map(patient => ({
            id: patient.PatientId,
            email: patient.Email,
            name: {
                first: patient.FirstName,
                last: patient.LastName
            },
            createDate: patient.CreateDate,
            modify: {
                by: patient.ModifyBy,
                date: patient.ModifyDate
            },
            demography: patient.patientDemographics() ? {
                dateofbirth: patient.patientDemographics().Dob,
                age: patient.patientDemographics().Age,
                gender: patient.patientDemographics().Gender,
                bloodgroup: patient.patientDemographics().BloodGroup,
                maritalstatus: patient.patientDemographics().MaritalStatus,
                create: {
                    by: patient.patientDemographics().CreateBy,
                    date: patient.patientDemographics().CreateDate
                },
                Modify: {
                    by: patient.patientDemographics().ModifyBy,
                    date: patient.patientDemographics().ModifyDate
                }
            } : {}

        }))
        return patientDetails;
    };

};

