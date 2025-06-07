const { EC2Client, AuthorizeSecurityGroupIngressCommand, RevokeSecurityGroupIngressCommand, DescribeSecurityGroupsCommand } = require('@aws-sdk/client-ec2');
const axios = require('axios');

const SECURITY_GROUP_ID = 'sg-06ee2d5c026ccb7b6';
const PORT = 5432;

async function getCurrentIP() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        console.error('Error getting current IP:', error);
        throw error;
    }
}

async function updateSecurityGroup(ec2Client, currentIP) {
    try {
        // First, get current rules
        const describeCommand = new DescribeSecurityGroupsCommand({
            GroupIds: [SECURITY_GROUP_ID]
        });
        const securityGroup = await ec2Client.send(describeCommand);
        
        // Revoke old rules
        const oldRules = securityGroup.SecurityGroups[0].IpPermissions
            .filter(rule => rule.FromPort === PORT)
            .flatMap(rule => rule.IpRanges.map(range => range.CidrIp));
        
        if (oldRules.length > 0) {
            const revokeCommand = new RevokeSecurityGroupIngressCommand({
                GroupId: SECURITY_GROUP_ID,
                IpPermissions: [{
                    IpProtocol: 'tcp',
                    FromPort: PORT,
                    ToPort: PORT,
                    IpRanges: oldRules.map(ip => ({ CidrIp: ip }))
                }]
            });
            await ec2Client.send(revokeCommand);
        }

        // Add new rule
        const authorizeCommand = new AuthorizeSecurityGroupIngressCommand({
            GroupId: SECURITY_GROUP_ID,
            IpPermissions: [{
                IpProtocol: 'tcp',
                FromPort: PORT,
                ToPort: PORT,
                IpRanges: [{ CidrIp: `${currentIP}/32` }]
            }]
        });
        await ec2Client.send(authorizeCommand);
        
        console.log(`Successfully updated security group with IP: ${currentIP}`);
    } catch (error) {
        console.error('Error updating security group:', error);
        throw error;
    }
}

async function main() {
    const ec2Client = new EC2Client({ region: 'eu-north-1' });
    const currentIP = await getCurrentIP();
    await updateSecurityGroup(ec2Client, currentIP);
}

main().catch(console.error); 