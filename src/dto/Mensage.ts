import * as yup from 'yup';

const messageDTO : yup.ObjectSchema = yup.object().shape({
    id: yup.string().required(),
    type: yup.string().required().equals(["text"]),
    to: yup.string().required(),
    body: yup.string().required()
});

export default messageDTO;