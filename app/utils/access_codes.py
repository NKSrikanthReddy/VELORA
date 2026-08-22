import secrets
import string

def generate_access_code(length: int = 5) -> str:
    """
    Generate a cryptographically secure random doctor access code.
    Format: MED-XXXXX (e.g. MED-7K29X).
    Does NOT depend on patient ID, timestamps, or email.
    """
    alphabet = string.ascii_uppercase + string.digits
    # Exclude easily confused characters O, 0, I, 1 for better readability
    clean_alphabet = [c for c in alphabet if c not in ('O', '0', 'I', '1')]
    random_str = ''.join(secrets.choice(clean_alphabet) for _ in range(length))
    return f"MED-{random_str}"
