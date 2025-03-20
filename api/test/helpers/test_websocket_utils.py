from unittest import mock
from helpers.websocket_utils import ws_send_party_msg


@mock.patch("helpers.websocket_utils.get_party_members_by_party_id")
def test_ws_send_party_msg(mock_get_party_members):
    mock_apigw_client = mock.Mock()
    mock_apigw_client.post_to_connection.return_value = None
    mock_get_party_members.return_value = [
        {"clientId": "je3"},
        {"clientId": "df3"},
        {"clientId": "ac3"},
    ]

    ws_send_party_msg(
        apigw_client=mock_apigw_client,
        party_id="fiesta3",
        data={"msg": "hola amigos"},
        excluded_recipients=["ac3"],
    )

    expected_calls = [
        mock.call(Data='{"msg": "hola amigos"}', ConnectionId="je3"),
        mock.call(Data='{"msg": "hola amigos"}', ConnectionId="df3"),
    ]
    mock_apigw_client.post_to_connection.assert_has_calls(
        expected_calls, any_order=True
    )
    assert mock_apigw_client.post_to_connection.call_count == len(expected_calls)
