def _contact(**overrides):
    data = {
        "name": "John Doe",
        "phone_number": "+12345678901",
        "relationship": "Friend",
        "email": "john@example.com",
    }
    data.update(overrides)
    return data


def test_contact_crud_flow(client):
    # Create
    resp = client.post("/contacts", json=_contact())
    assert resp.status_code == 201
    created = resp.json()
    contact_id = created["id"]
    assert created["name"] == "John Doe"

    # Read (list + by id)
    assert any(c["id"] == contact_id for c in client.get("/contacts").json())
    assert client.get(f"/contacts/{contact_id}").status_code == 200

    # Update
    upd = client.put(f"/contacts/{contact_id}", json={"name": "Jane Doe"})
    assert upd.status_code == 200
    assert upd.json()["name"] == "Jane Doe"

    # Delete
    assert client.delete(f"/contacts/{contact_id}").status_code == 204
    assert client.get(f"/contacts/{contact_id}").status_code == 404


def test_get_unknown_contact_returns_404(client):
    assert client.get("/contacts/nope").status_code == 404


def test_create_contact_invalid_phone_returns_422(client):
    resp = client.post("/contacts", json=_contact(phone_number="123"))
    assert resp.status_code == 422
