import { Anchor, Button, Checkbox, LoadingOverlay, PasswordInput, TextInput, Paper, Table, Badge } from "@mantine/core";
import { IconAt, IconCheck, IconLock, IconX, IconUser, IconBuilding } from "@tabler/icons-react";
import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import { loginValidation } from "../../Services/FormValidation";
import { useDisclosure } from "@mantine/hooks";
import ResetPassword from "./ResetPassword";
import { errorNotification, successNotification } from "../../Services/NotificationService";
import { useDispatch } from "react-redux";
import { setUser } from "../../Slices/UserSlice";
import { setJwt } from "../../Slices/JwtSlice";
import { loginUser } from "../../Services/AuthService";
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const dispatch = useDispatch();
    const form = {
        email: "",
        password: "",
    }
    const [opened, { open, close }] = useDisclosure(false);
    const [data, setData] = useState<{ [key: string]: string }>(form);
    const [formError, setFormError] = useState<{ [key: string]: string }>(form);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleChange = (event: any) => {
        setFormError({...formError, [event.target.name]:""});
        setData({ ...data, [event.target.name]: event.target.value });
    }
    const handleSubmit = () => {
        let valid = true, newFormError: { [key: string]: string } = {};
        for (let key in data) {
            newFormError[key] = loginValidation(key, data[key]);
            if (newFormError[key]) valid = false;
        }
        setFormError(newFormError);
        if (valid) {
            setLoading(true);
            loginUser(data).then((res) => {
                successNotification("Login Successful", "Redirecting to home page...");
                dispatch(setJwt(res.jwt));
                const decoded=jwtDecode(res.jwt);
                dispatch(setUser({...decoded, email:decoded.sub}));
                setTimeout(() => {
                    navigate("/");
                }, 4000)
            }).catch((err) => {
                console.log(err);
                    errorNotification("Login Failed", err.response.data.errorMessage);
                    setLoading(false);
            });

        }
    }
    return <>   <LoadingOverlay
    visible={loading}
    zIndex={1000}
    overlayProps={{ radius: 'sm', blur: 2 }}
    loaderProps={{ color: 'brightSun.4', type: 'bars' }}
  /><div data-aos="zoom-out" className="w-1/2 sm-mx:w-full px-20  bs-mx:px-10 md-mx:px-5  flex flex-col gap-3 justify-center">
        
        {/* Test Accounts Table */}
        <Paper shadow="xs" p="md" mb="md" withBorder>
            <div className="text-lg font-semibold mb-3 text-center">Test Accounts</div>
            <Table striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Role</Table.Th>
                        <Table.Th>Login</Table.Th>
                        <Table.Th>Password</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Td>
                            <Badge leftSection={<IconUser size={12} />} color="blue" variant="light">
                                Applicant
                            </Badge>
                        </Table.Td>
                        <Table.Td className="font-mono text-sm">applicant_login@gmail.com</Table.Td>
                        <Table.Td className="font-mono text-sm">Applicant1!</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td>
                            <Badge leftSection={<IconBuilding size={12} />} color="green" variant="light">
                                Employer
                            </Badge>
                        </Table.Td>
                        <Table.Td className="font-mono text-sm">employer_login@gmail.com</Table.Td>
                        <Table.Td className="font-mono text-sm">Employer1!</Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
        </Paper>

        <div className="text-2xl font-semibold">Login</div>
        <TextInput value={data.email} error={formError.email} name="email" onChange={handleChange} leftSection={<IconAt size={16} />} label="Email" withAsterisk placeholder="Your email" />
        <PasswordInput value={data.password} error={formError.password} name="password" onChange={handleChange} leftSection={<IconLock size={16} />} label="Password" withAsterisk placeholder="Password" />
        <Button loading={loading} onClick={handleSubmit} autoContrast variant="filled">Login</Button>
                    <div className="text-center sm-mx:text-sm xs-mx:text-xs">Don't have an account? <span className="text-ocean-blue-400 hover:underline cursor-pointer" onClick={()=>{navigate("/signup");setFormError(form) ;setData(form)}}>SignUp</span> </div>
            <div className="text-ocean-blue-400 sm-mx:text-sm xs-mx:text-xs hover:underline cursor-pointer text-center" onClick={open}>Forget Password?</div>

    </div>
    <ResetPassword opened={opened} close={close} />
    </>
}
export default Login;